/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { toggleSignIn, toggleSignOut, stateChange } from "../../.firebase/auth";
import { storage, database } from "../../.firebase/firebase"; // Firebase imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push, onValue } from "firebase/database"; // Realtime Database methods
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../styles.css";

// Dynamically import ReactQuill and disable SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [maintainer, setMaintainer] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const [selectedFiles, setSelectedFiles] = useState<{
    csv?: File[];
    json?: File[];
    xml?: File[];
    rdf?: File[];
  }>({});

  interface UploadData {
    id: string;
    name: string;
    author?: string;
    maintainer?: string;
    department?: string;
    description: string;
    category: string;
    file: {
      csv?: string;
      json?: string;
      xml?: string;
      rdf?: string;
    };
    image: string;
    uploadedAt: string;
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [uploadsData, setUploadsData] = useState<UploadData[]>([]);

  useEffect(() => {
    setIsMounted(true); // Avoid hydration mismatch by rendering only after mount
  }, []);

  /**
   * Effect to listen for user authentication state changes.
   * Animates the component's fade-in and translation effects.
   * @param - none
   * @return {void}
   */
  useEffect(() => {
    const unsubscribe = stateChange((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // LOGIN FUNCTIONS

  /**
   * Handles the user login process.
   * @param {React.FormEvent} e - The event triggered by the form submission.
   * @return {Promise<void>}
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await toggleSignIn(email, password);
      Swal.fire("Success", "Logged in successfully", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  /**
   * Handles the user logout process.
   * @return {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await toggleSignOut();
      Swal.fire("Success", "Logged out successfully", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // CREATE FUNCTIONS

  // Handle file input change (validate accepted formats)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newSelectedFiles: { [key: string]: File[] } = { ...selectedFiles };

      filesArray.forEach((file) => {
        switch (file.type) {
          case "text/csv":
            newSelectedFiles.csv = newSelectedFiles.csv || [];
            newSelectedFiles.csv.push(file);
            break;
          case "application/json":
            newSelectedFiles.json = newSelectedFiles.json || [];
            newSelectedFiles.json.push(file);
            break;
          case "application/xml":
          case "text/xml":
            newSelectedFiles.xml = newSelectedFiles.xml || [];
            newSelectedFiles.xml.push(file);
            break;
          case "application/rdf+xml":
            newSelectedFiles.rdf = newSelectedFiles.rdf || [];
            newSelectedFiles.rdf.push(file);
            break;
          default:
            setUploadStatus(`File type ${file.type} is not supported`);
        }
      });

      setSelectedFiles(newSelectedFiles);
    }
  };

  // Handle image input change (validate PNG and JPEG)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = files[0];
      const acceptedImageTypes = ["image/png", "image/jpeg"];

      if (acceptedImageTypes.includes(image.type)) {
        setSelectedImage(image);
      } else {
        setUploadStatus("Only PNG and JPEG images are allowed");
      }
    }
  };

  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  }

  const handleMaintainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintainer(e.target.value);
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
  }

  // Handle description input change (Quill Editor)
  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  // Handle category selection change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle file and image upload
  const handleFileUpload = async () => {
    if (!name || !description || !selectedCategory) {
      setUploadStatus("Please fill in all required fields (*)");
      return;
    }

    if (Object.keys(selectedFiles).length === 0) {
      setUploadStatus("No file selected");
      return;
    }

    if (!selectedImage) {
      setUploadStatus("No image selected");
      return;
    }

    try {
      const fileUrls: { [key: string]: string[] } = {};

      // Upload each file type array
      for (const [fileType, files] of Object.entries(selectedFiles)) {
        if (!files || !Array.isArray(files)) continue;

        const capitalizedFileType = fileType.toUpperCase();
        fileUrls[capitalizedFileType] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const storageRef = ref(storage, `Admin/${fileType}/${file.name}`);
          const fileUploadTask = uploadBytesResumable(storageRef, file);

          await new Promise<void>((resolve, reject) => {
            fileUploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadStatus(
                  `${capitalizedFileType} file ${
                    i + 1
                  } upload is ${progress}% done`
                );
              },
              (error) => {
                console.error(
                  `Error uploading ${capitalizedFileType} file ${i + 1}:`,
                  error
                );
                reject(error);
              },
              async () => {
                const fileUrl = await getDownloadURL(
                  fileUploadTask.snapshot.ref
                );
                fileUrls[capitalizedFileType].push(fileUrl);
                resolve();
              }
            );
          });
        }
      }

      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `Admin/Images/${selectedImage.name}`);
      const imageUploadTask = uploadBytesResumable(imageRef, selectedImage);

      await new Promise<string>((resolve, reject) => {
        imageUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadStatus(`Image upload is ${progress}% done`);
          },
          reject,
          async () => {
            const imageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
            resolve(imageUrl);
          }
        );
      }).then(async (imageUrl) => {
        // Save to Realtime Database with indexed file structure
        const uploadsRef = dbRef(database, "Admin");
        await push(uploadsRef, {
          name,
          author,
          maintainer,
          department,
          description,
          category: selectedCategory,
          file: fileUrls, // This will now contain arrays of URLs for each file type
          image: imageUrl,
          uploadedAt: new Date().toISOString(),
        });

        setUploadStatus("Upload completed successfully");
        handleReset();
      });
    } catch (error) {
      console.error("Error uploading files or image:", error);
      setUploadStatus("Error during upload process");
    }
  };

  // Handle resetting the form fields
  const handleReset = () => {
    setName("");
    setAuthor("");
    setMaintainer("");
    setDepartment("");
    setDescription("");
    setSelectedCategory("");
    setSelectedFiles({});
    setSelectedImage(null);
    setUploadStatus("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // READ FUNCTIONS

  // Fetch the uploaded data when the component mounts
  useEffect(() => {
    fetchUploads();
  }, []);

  /**
   * Fetches the uploaded data from the Firebase Realtime Database.
   * Updates the state with the fetched uploads.
   * @return {void}
   */
  const fetchUploads = () => {
    const uploadsRef = dbRef(database, "Admin");

    onValue(uploadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uploadsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Update uploadsData state correctly
        setUploadsData(uploadsList);
      }
    });
  };

  if (!isMounted) return null;
  if (isLoading) return <div>Loading...</div>;
  if (!user) {
    return (
      <div className="container mt-5">
        <h3 className="text-center mb-4">Admin Portal</h3>

        <form onSubmit={handleLogin} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Upload File and Image</h3>

      <div className="row mb-3 g-3">
        <div className="col">
          <label className="form-label">Title:</label>
          <span style={{color: 'red'}}>*</span>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter the title"
            className="form-control"
            required
          />
        </div>
        <div className="col">
        <label className="form-label">Author:</label>
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
            placeholder="Enter author name"
            className="form-control"
          />
        </div>
        <div className="col">
          <label className="form-label">Maintainer:</label>
          <input
            type="text"
            value={maintainer}
            onChange={handleMaintainerChange}
            placeholder="Enter maintainer name"
            className="form-control"
          />
        </div>
        <div className="col">
          <label className="form-label">Department/Agency:</label>
          <input
            type="text"
            value={department}
            onChange={handleDepartmentChange}
            placeholder="Enter department or agency"
            className="form-control"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description:</label>
        <span style={{color: 'red'}}>*</span>
        <ReactQuill
          value={description}
          onChange={handleDescriptionChange}
          theme="snow"
          className="border"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category:</label>
        <span style={{color: 'red'}}>*</span>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="form-select"
          required
        >
          <option value="">Select a category</option>
          <option value="Transportation">Transportation</option>
          <option value="Community">Community</option>
          <option value="School">School</option>
          <option value="Employment">Employment</option>
          <option value="Public Safety">Public Safety</option>
        </select>
      </div>

      <div className="mb-3">
        <p className="mt-2 text-muted">Note: You can upload multiple files at once.</p>
        <label className="form-label">Upload Files (CSV, JSON, XML, RDF):</label>
        <span style={{color: 'red'}}>*</span>
        <input
          type="file"
          accept=".csv,application/json,application/xml,text/xml,application/rdf+xml"
          onChange={handleFileChange}
          ref={fileInputRef}
          multiple
          className="d-none"
          required
        />
        <button
          type="button"
          className="btn btn-primary btn-sm ms-2"
          onClick={() => fileInputRef.current?.click()} // triggers the file input dialog
        >
          Add Files
        </button>
        {Object.entries(selectedFiles).map(([fileType, files]) => (
          <div key={fileType} className="mt-2">
            <strong>{fileType.toUpperCase()} files:</strong>
            <ul className="list-unstyled ms-3">
              {Array.isArray(files) &&
                files.map((file, index) => <li key={index}>{file.name}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Image (PNG, JPEG):</label>
        <span style={{color: 'red'}}>*</span>
        <input
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={handleImageChange}
          ref={imageInputRef}
          className="form-control"
          required
        />
      </div>

      <div className="d-flex justify-content-between">
        <button onClick={handleFileUpload} className="btn btn-primary">
          Upload
        </button>
        <div>
          <button className="btn btn-danger me-3" onClick={handleLogout}>
            Logout
          </button>
          <button onClick={handleReset} className="btn btn-secondary">
            Start Over
          </button>
        </div>
      </div>

      {uploadStatus && <p className="mt-3 text-danger">{uploadStatus}</p>}

      {/*<div className="mt-5">
          <h4>Uploaded Files</h4>
          {["Transportation", "Health", "Education", "Energy"].map((category, index) => (
              <DownloadCSVFiles key={index} category={category}/>
          ))}
        </div>*/}
    </div>
  );
};

export default AdminPortal;
