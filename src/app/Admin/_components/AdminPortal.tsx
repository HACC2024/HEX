/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  toggleSignIn,
  toggleSignOut,
  stateChange,
  checkAdminRole,
} from "../../../../.firebase/auth";
import { storage, database, auth } from "../../../../.firebase/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  ref as dbRef,
  push,
  onValue,
  update,
  remove,
  get,
} from "firebase/database";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles.css";
import AdminManagement from "./AdminManagement";
import SecurityManagement from "./SecurityManagement";
import UserManagement from "./UserManagement";
import Chatbot from "../../../components/Chatbot";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import ReCAPTCHA from "react-google-recaptcha";
import ProjectManagement from "./ProjectManagement";

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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [isUnmounting, setIsUnmounting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "admins" | "security" | "users" | "projects"
  >("content");
  const [userName, setUserName] = useState<string>("");
  const [showChatbot, setShowChatbot] = useState(false);

  // States for edit
  const [editingUpload, setEditingUpload] = useState<UploadData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editMaintainer, setEditMaintainer] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const [editFiles, setEditFiles] = useState<{
    [key: string]: {
      existing: { url: string; toDelete: boolean }[];
      new: File[];
    };
  }>({});

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

  //Captcha
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    setIsMounted(true); // Avoid hydration mismatch by rendering only after mount
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const userRef = dbRef(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData?.displayName) {
          setUserName(userData.displayName);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  /**
   * Effect to listen for user authentication state changes.
   * Animates the component's fade-in and translation effects.
   * @param - none
   * @return {void}
   */
  useEffect(() => {
    let unsubscribeFromData: (() => void) | undefined;

    const unsubscribeFromAuth = stateChange(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        try {
          const isAdminUser = await checkAdminRole(currentUser);
          if (!isAdminUser) {
            await toggleSignOut(auth);
            Swal.fire(
              "Error",
              "You are attempting to access the Admin Control Center. Please close The Admin Panel below and Try Again!",
              "error"
            );
            setUser(null);
            setIsAdmin(false);
          } else {
            setUser(currentUser);
            setIsAdmin(true);
            // Fetch data immediately after confirming admin status
            unsubscribeFromData = fetchUploads();
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        // Clean up data subscription if it exists
        if (unsubscribeFromData) {
          unsubscribeFromData();
        }
        // Clear uploads data when logged out
        setUploadsData([]);
      }
      setIsLoading(false);
      setAuthChecked(true);
    });

    // Cleanup function
    return () => {
      setIsUnmounting(true);
      if (unsubscribeFromData) {
        unsubscribeFromData();
      }
      unsubscribeFromAuth();
    };
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
      // Get the reCAPTCHA token
      const token = await recaptchaRef.current?.getValue();
      if (!token) {
        Swal.fire("Please complete the reCAPTCHA verification.");
        return;
      }
      // First get the user status from the database
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = dbRef(database, `users/${userCredential.user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      // Check if account is deactivated
      if (userData.status === "deactivated" || userData.active === false) {
        await signOut(auth); // Sign out if deactivated
        Swal.fire(
          "Error",
          "This account has been deactivated. Please contact an administrator.",
          "error"
        );
        return;
      }

      // Then check admin status
      if (userData.role === "admin") {
        Swal.fire("Success", "Logged in as administrator", "success");
      } else {
        await signOut(auth);
        Swal.fire("Error", "Invalid admin credentials", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", "Invalid admin credentials", "error");
    }
  };

  /**
   * Handles the user logout process.
   * @return {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      setIsUnmounting(true); // Set flag before logout
      await toggleSignOut(auth);
      Swal.fire("Success", "Logged out successfully", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsUnmounting(false); // Reset flag after logout
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
  };

  const handleMaintainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintainer(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
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

  /**
   * Fetches the uploaded data from the Firebase Realtime Database.
   * Updates the state with the fetched uploads.
   * @return {void}
   */
  const fetchUploads = (): (() => void) | undefined => {
    try {
      const uploadsRef = dbRef(database, "Admin");

      const unsubscribe = onValue(
        uploadsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const uploadsList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setUploadsData(uploadsList);
          } else {
            setUploadsData([]); // Set empty array if no data exists
          }
        },
        (error) => {
          // Only show error if we're not unmounting/logging out and it's an unexpected error
          if (!isUnmounting && (error as any).code !== "PERMISSION_DENIED") {
            console.error("Error fetching uploads:", error);
            Swal.fire("Error", "Failed to fetch data", "error");
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      // Only show error if we're not unmounting/logging out
      if (!isUnmounting) {
        console.error("Error setting up data listener:", error);
        Swal.fire("Error", "Failed to initialize data connection", "error");
      }
      return undefined;
    }
  };

  // EDIT FUNCTIONS
  const handleEditClick = (upload: UploadData) => {
    setEditingUpload(upload);
    setEditName(upload.name);
    setEditAuthor(upload.author || "");
    setEditMaintainer(upload.maintainer || "");
    setEditDepartment(upload.department || "");
    setEditDescription(upload.description);
    setEditCategory(upload.category);

    const initialEditFiles: typeof editFiles = {};
    Object.entries(upload.file || {}).forEach(([fileType, urls]) => {
      if (Array.isArray(urls)) {
        initialEditFiles[fileType] = {
          existing: urls.map((url) => ({ url, toDelete: false })),
          new: [],
        };
      }
    });
    setEditFiles(initialEditFiles);
    setShowEditModal(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newEditFiles = { ...editFiles };

      filesArray.forEach((file) => {
        let fileType = "";
        switch (file.type) {
          case "text/csv":
            fileType = "CSV";
            break;
          case "application/json":
            fileType = "JSON";
            break;
          case "application/xml":
          case "text/xml":
            fileType = "XML";
            break;
          case "application/rdf+xml":
            fileType = "RDF";
            break;
          default:
            return;
        }

        if (!newEditFiles[fileType]) {
          newEditFiles[fileType] = { existing: [], new: [] };
        }
        newEditFiles[fileType].new.push(file);
      });

      setEditFiles(newEditFiles);
    }
  };

  const toggleFileDelete = (fileType: string, index: number) => {
    setEditFiles((prev) => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        existing: prev[fileType].existing.map((file, i) =>
          i === index ? { ...file, toDelete: !file.toDelete } : file
        ),
      },
    }));
  };

  const removeNewFile = (fileType: string, index: number) => {
    setEditFiles((prev) => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        new: prev[fileType].new.filter((_, i) => i !== index),
      },
    }));
  };

  const handleUpdate = async () => {
    if (!editingUpload) return;

    try {
      let imageUrl = editingUpload.image;
      const updatedFiles: { [key: string]: string[] } = {};

      // If a new image was selected, upload it
      if (editImage) {
        // Delete old image
        const oldImageRef = ref(storage, editingUpload.image);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }

        // Upload new image
        const imageRef = ref(storage, `Admin/Images/${editImage.name}`);
        const imageUploadTask = uploadBytesResumable(imageRef, editImage);
        imageUrl = await new Promise((resolve, reject) => {
          imageUploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadStatus(`Image update is ${progress}% done`);
            },
            reject,
            async () => {
              const url = await getDownloadURL(imageUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      for (const [fileType, files] of Object.entries(editFiles)) {
        updatedFiles[fileType] = [];

        for (const existingFile of files.existing) {
          if (existingFile.toDelete) {
            const fileRef = ref(storage, existingFile.url);
            try {
              await deleteObject(fileRef);
            } catch (error) {
              console.error(`Error deleting file: ${existingFile.url}`, error);
            }
          } else {
            updatedFiles[fileType].push(existingFile.url);
          }
        }

        for (const newFile of files.new) {
          const fileRef = ref(storage, `Admin/${fileType}/${newFile.name}`);
          const uploadTask = uploadBytesResumable(fileRef, newFile);

          const url = await new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadStatus(`${fileType} file upload is ${progress}% done`);
              },
              reject,
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });

          updatedFiles[fileType].push(url);
        }
      }
      // Update the database
      const updateRef = dbRef(database, `Admin/${editingUpload.id}`);
      await update(updateRef, {
        name: editName,
        author: editAuthor,
        maintainer: editMaintainer,
        department: editDepartment,
        description: editDescription,
        category: editCategory,
        image: imageUrl,
        file: updatedFiles,
        updatedAt: new Date().toISOString(),
      });

      setShowEditModal(false);
      setEditingUpload(null);
      setEditImage(null);
      setEditFiles({});
      Swal.fire("Success", "Record updated successfully", "success");
    } catch (error) {
      console.error("Error updating record:", error);
      Swal.fire("Error", "Failed to update record", "error");
    }
  };

  // Function to handle delete
  const handleDelete = async (upload: UploadData) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete the image from storage
        const imageRef = ref(storage, upload.image);
        await deleteObject(imageRef);

        // Delete all associated files from storage
        for (const [fileType, urls] of Object.entries(upload.file || {})) {
          if (Array.isArray(urls)) {
            for (const url of urls) {
              const fileRef = ref(storage, url);
              await deleteObject(fileRef);
            }
          }
        }

        // Delete the database entry
        const dbItemRef = dbRef(database, `Admin/${upload.id}`);
        await remove(dbItemRef);

        Swal.fire("Deleted!", "Record has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire("Error", "Failed to delete record", "error");
      }
    }
  };

  if (!isMounted) return null;
  if (isLoading && !authChecked) return <div>Loading...</div>;
  if (!user || !isAdmin) {
    return (
      <div className="container mt-5">
        <h3 className="text-center mb-4">Admin Portal</h3>

        <form onSubmit={handleLogin} className="mb-3">
          <div className="mb-3">
            <div className="alert alert-info">
              This portal is only accessible to administrators.
            </div>
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

          {/* CAPTCHA DIV */}

          <ReCAPTCHA
            className="py-3"
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-4">
      <div className="card">
        <div className="bg-dark text-white card-header">
          <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
            <h5 className="mb-0 text-info">
              Welcome, {userName || user?.email || "Admin"}
            </h5>
            <span
              className="badge bg-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowChatbot(!showChatbot)}
            >
              {showChatbot ? "Hide Chat" : "Chat With HEX Admin"}{" "}
            </span>
          </div>
          <div className="mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link text-primary ${
                    activeTab === "content" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Content Management
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-primary ${
                    activeTab === "admins" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("admins")}
                >
                  Admin Management
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-primary ${
                    activeTab === "users" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("users")}
                >
                  User Management
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-primary ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  Security Reports
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-primary ${
                    activeTab === "projects" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("projects")}
                >
                  Project Management
                </button>
              </li>
              <li className="nav-item ms-auto">
                <button className="nav-link text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div className="card bg-info mb-4">
            {showChatbot && (
              <div className="chatbot-container mt-0 mb-0">
                <Chatbot />
              </div>
            )}
          </div>

          {activeTab === "content" ? (
            <>
              <div className="card">
                <div className="card-header bg-info">
                  <h3 className="card-title mb-0">Content Management</h3>
                </div>
                <div className="card-body">
                  <div className="row mb-3 g-3">
                    <div className="col">
                      <label className="form-label">Title:</label>
                      <span style={{ color: "red" }}>*</span>
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
                    <span style={{ color: "red" }}>*</span>
                    <ReactQuill
                      value={description}
                      onChange={handleDescriptionChange}
                      theme="snow"
                      className="border"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category:</label>
                    <span style={{ color: "red" }}>*</span>
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
                    <p className="mt-4" style={{ color: "grey" }}>
                      Note: You can upload multiple files at once.
                    </p>
                    <label className="form-label">
                      Upload Files (CSV, JSON, XML, RDF):
                    </label>
                    <span style={{ color: "red" }}>*</span>
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
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add Files
                    </button>
                    {Object.entries(selectedFiles).map(([fileType, files]) => (
                      <div key={fileType} className="mt-2">
                        <strong>{fileType.toUpperCase()} files:</strong>
                        <ul className="list-unstyled ms-3">
                          {Array.isArray(files) &&
                            files.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image (PNG, JPEG):</label>
                    <span style={{ color: "red" }}>*</span>
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
                    <button
                      onClick={handleFileUpload}
                      className="btn btn-primary"
                    >
                      Upload
                    </button>
                    <div>
                      <button
                        onClick={handleReset}
                        className="btn btn-secondary"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {uploadStatus && (
                <p className="mt-3 text-danger">{uploadStatus}</p>
              )}

              <div className="mt-4">
                <div className="card mb-4">
                  <div className="card-header bg-info">
                    <h3 className="card-title mb-0">View Uploaded Content</h3>
                  </div>
                  <div className="card-body mb-2">
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "500px" }}
                    >
                      <table className="table table-striped table-bordered">
                        <thead className="sticky-top bg-white">
                          <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Maintainer</th>
                            <th>Department</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Files</th>
                            <th>Image</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadsData.map((upload) => (
                            <tr key={upload.id}>
                              <td>{upload.name}</td>
                              <td>{upload.author || "N/A"}</td>
                              <td>{upload.maintainer || "N/A"}</td>
                              <td>{upload.department || "N/A"}</td>
                              <td>{upload.category}</td>
                              <td>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: upload.description,
                                  }}
                                  style={{
                                    maxWidth: "300px",
                                    maxHeight: "100px",
                                    overflow: "auto",
                                  }}
                                />
                              </td>
                              <td>
                                <div
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "100px",
                                    overflow: "auto",
                                  }}
                                >
                                  {Object.entries(upload.file || {}).map(
                                    ([fileType, urls]) => (
                                      <div key={fileType}>
                                        <strong>{fileType}:</strong>
                                        <ul className="list-unstyled ms-2">
                                          {Array.isArray(urls) &&
                                            urls.map((url, index) => (
                                              <li key={index}>
                                                <a
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  File {index + 1}
                                                </a>
                                              </li>
                                            ))}
                                        </ul>
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                              <td>
                                <img
                                  src={upload.image}
                                  alt={upload.name}
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                    objectFit: "contain",
                                  }}
                                />
                              </td>
                              <td>
                                {new Date(upload.uploadedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditClick(upload)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(upload)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Modal */}
              {showEditModal && (
                <div className="card">
                  <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content" style={{ backgroundColor: "white" }}>
                        <div className="modal-header bg-dark text-info">
                          <h5 className="modal-title">Edit Record</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowEditModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label">Title:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Author:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editAuthor}
                              onChange={(e) => setEditAuthor(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Maintainer:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editMaintainer}
                              onChange={(e) =>
                                setEditMaintainer(e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Department:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editDepartment}
                              onChange={(e) =>
                                setEditDepartment(e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Description:</label>
                            <ReactQuill
                              value={editDescription}
                              onChange={setEditDescription}
                              theme="snow"
                            />
                          </div>
                          <div className="mb-5">
                            <label className="form-label">Category:</label>
                            <select
                              className="form-select"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                            >
                              <option value="">Select a category</option>
                              <option value="Transportation">
                                Transportation
                              </option>
                              <option value="Community">Community</option>
                              <option value="School">School</option>
                              <option value="Employment">Employment</option>
                              <option value="Public Safety">
                                Public Safety
                              </option>
                            </select>
                          </div>
                          <div className="mb-3">

                            {/* Existing Files */}
                            {Object.entries(editFiles).map(
                              ([fileType, files]) => (
                                <div key={fileType} className="mb-3">
                                  <h6 className="text-center"><u>{fileType} Files:</u></h6>

                                  {/* Existing Files List */}
                                  {files.existing.length > 0 && (
                                    <div className="mb-2">
                                      <h6>Existing:</h6>
                                      <ul className="list-group">
                                        {files.existing.map((file, index) => (
                                          <li
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                          >
                                            <a
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={
                                                file.toDelete
                                                  ? "text-decoration-line-through"
                                                  : ""
                                              }
                                            >
                                              File {index + 1}
                                            </a>
                                            <button
                                              type="button"
                                              className={`btn btn-${
                                                file.toDelete
                                                  ? "warning"
                                                  : "danger"
                                              } btn-sm`}
                                              onClick={() =>
                                                toggleFileDelete(
                                                  fileType,
                                                  index
                                                )
                                              }
                                            >
                                              {file.toDelete
                                                ? "Undo Delete"
                                                : "Delete"}
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* New Files List */}
                                  {files.new.length > 0 && (
                                    <div className="mb-2">
                                      <h6>New:</h6>
                                      <ul className="list-group">
                                        {files.new.map((file, index) => (
                                          <li
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                          >
                                            <span>{file.name}</span>
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm"
                                              onClick={() =>
                                                removeNewFile(fileType, index)
                                              }
                                            >
                                              Remove
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )
                            )}

                            {/* Add New Files */}
                            <div className="mt-5">
                              <label className="form-label">
                                Add New Files:
                              </label>
                              <input
                                type="file"
                                accept=".csv,application/json,application/xml,text/xml,application/rdf+xml"
                                onChange={handleEditFileChange}
                                multiple
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              New Image (optional):
                            </label>
                            <input
                              type="file"
                              accept=".png,.jpeg,.jpg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setEditImage(e.target.files[0]);
                                }
                              }}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowEditModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdate}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : activeTab === "admins" ? (
            <AdminManagement />
          ) : activeTab === "security" ? (
            <SecurityManagement />
          ) : activeTab === "users" ? (
            <UserManagement />
          ) : activeTab === "projects" ? (
            <ProjectManagement />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
