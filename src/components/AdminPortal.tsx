/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { toggleSignIn, toggleSignOut, stateChange } from "../../.firebase/auth";
import { storage, database } from "../../.firebase/firebase"; // Firebase imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push, onValue } from "firebase/database"; // Realtime Database methods
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import "../styles.css";
import DownloadCSVFiles from "./DataCards";

// Dynamically import ReactQuill and disable SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState<string>(""); // New state for description
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for dropdown
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For file upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // For image upload
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const [uploadsData, setUploadsData] = useState<any[]>([]);

  // Ref for the file and image input to reset them
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Hydration workaround for Next.js
  const [isMounted, setIsMounted] = useState(false);

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
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const acceptedTypes = [
        "text/csv",
        "text/html",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
        "application/rdf+xml", // RDF
      ];

      if (acceptedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        setUploadStatus("Only CSV, HTML, XLSX, and RDF files are allowed");
      }
    }
  };

  // Handle image input change (validate PNG and JPEG)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];
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
      setUploadStatus("Please fill in all fields and select a category");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("No file selected");
      return;
    }

    if (!selectedImage) {
      setUploadStatus("No image selected");
      return;
    }

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `Test/${selectedFile.name}`);
      const fileUploadTask = uploadBytesResumable(storageRef, selectedFile);

      fileUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadStatus(`File upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          setUploadStatus("Error uploading file");
        },
        async () => {
          const fileUrl = await getDownloadURL(fileUploadTask.snapshot.ref);

          // Upload the image to Firebase Storage
          const imageRef = ref(storage, `Test/Images/${selectedImage.name}`);
          const imageUploadTask = uploadBytesResumable(imageRef, selectedImage);

          imageUploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadStatus(`Image upload is ${progress}% done`);
            },
            (error) => {
              console.error("Error uploading image:", error);
              setUploadStatus("Error uploading image");
            },
            async () => {
              const imageUrl = await getDownloadURL(
                imageUploadTask.snapshot.ref
              );
              setUploadStatus("File and image uploaded successfully");

              // Save the data to Realtime Database
              const uploadsRef = dbRef(database, "Test");
              await push(uploadsRef, {
                name: name, // Save the name
                description: description, // Save the description
                category: selectedCategory, // Save the category
                file: {
                  CSV: fileUrl,
                  JSON: fileUrl,
                  RDF: fileUrl,
                  XML: fileUrl,
                }, // Save the file URL
                image: imageUrl, // Save the image URL
                uploadedAt: new Date().toISOString(),
              });

              setUploadStatus("Data saved to Realtime Database");

              // Clear input fields after successful upload
              handleReset();
            }
          );
        }
      );
    } catch (error) {
      console.error("Error uploading file or image:", error);
      setUploadStatus("Error during upload process");
    }
  };

  // Handle resetting the form fields
  const handleReset = () => {
    setName("");
    setDescription("");
    setSelectedCategory("");
    setSelectedFile(null);
    setSelectedImage(null);
    setUploadStatus("");

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // READ FUNCTIONS

  /**
   * Fetches the uploaded data from the Firebase Realtime Database.
   * Updates the state with the fetched uploads.
   * @return {void}
   */
  const fetchUploads = () => {
    const uploadsRef = dbRef(database, "Test");

    onValue(uploadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uploadsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUploadsData(uploadsList); // Update state with fetched uploads
      }
    });
  };

  // Fetch the uploaded data when the component mounts
  useEffect(() => {
    fetchUploads();
  }, []);

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

        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter the title"
              className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              theme="snow"
              className="border"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-select"
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
          <label className="form-label">File (CSV, HTML, XLSX, RDF):</label>
          <input
              type="file"
              accept=".csv,.html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.rdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image (PNG, JPEG):</label>
          <input
              type="file"
              accept=".png,.jpeg,.jpg"
              onChange={handleImageChange}
              ref={imageInputRef}
              className="form-control"
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

        <div className="mt-5">
          <h4>Uploaded Files</h4>
          {["Transportation", "Health", "Education", "Energy"].map((category, index) => (
              <DownloadCSVFiles key={index} category={category}/>
          ))}
        </div>
      </div>
  );
};

export default AdminPortal;

