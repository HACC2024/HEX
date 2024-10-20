"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import { storage, database } from "../firebase"; // Firebase imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database"; // Realtime Database methods
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import "../styles.css";

// Dynamically import ReactQuill and disable SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [description, setDescription] = useState<string>(""); // New state for description
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for dropdown
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For file upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // For image upload
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Ref for the file and image input to reset them
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Hydration workaround for Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Avoid hydration mismatch by rendering only after mount
  }, []);

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
      const storageRef = ref(storage, `Admin/${selectedFile.name}`);
      const fileUploadTask = uploadBytesResumable(storageRef, selectedFile);

      fileUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadStatus(`File upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          setUploadStatus("Error uploading file");
        },
        async () => {
          const fileUrl = await getDownloadURL(fileUploadTask.snapshot.ref);

          // Upload the image to Firebase Storage
          const imageRef = ref(storage, `Admin/Images/${selectedImage.name}`);
          const imageUploadTask = uploadBytesResumable(imageRef, selectedImage);

          imageUploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadStatus(`Image upload is ${progress}% done`);
            },
            (error) => {
              console.error("Error uploading image:", error);
              setUploadStatus("Error uploading image");
            },
            async () => {
              const imageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
              setUploadStatus("File and image uploaded successfully");

              // Save the data to Realtime Database
              const uploadsRef = dbRef(database, "Admin");
              await push(uploadsRef, {
                name: name, // Save the name
                description: description, // Save the description
                category: selectedCategory, // Save the category
                file: fileUrl, // Save the file URL
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

  if (!isMounted) return null;

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
        <select value={selectedCategory} onChange={handleCategoryChange} className="form-select">
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
        <button onClick={handleFileUpload} className="btn btn-primary">Upload</button>
        <button onClick={handleReset} className="btn btn-secondary">Start Over</button>
      </div>

      {uploadStatus && <p className="mt-3 text-danger">{uploadStatus}</p>}
    </div>
  );
};

export default AdminPortal;
