"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import { storage, database } from "../firebase"; // Replace firestoreDb with database
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database"; // Realtime Database methods
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import "../styles.css"

// Dynamically import ReactQuill and disable SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [description, setDescription] = useState<string>(""); // New state for description
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for dropdown
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>(""); 

  // Ref for the file input to reset it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Handle file upload
  const handleFileUpload = async () => {
    if (!name || !description || !selectedCategory) {
      setUploadStatus("Please fill in all fields and select a category");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("No file selected");
      return;
    }

    // Create a storage reference in Firebase Storage
    const storageRef = ref(storage, `Admin/${selectedFile.name}`);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get progress information
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadStatus(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploadStatus("Error uploading file");
      },
      async () => {
        // Handle successful upload
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadStatus("File uploaded successfully");

        // Save the file info along with the name, description, and category to Realtime Database
        try {
          const uploadsRef = dbRef(database, "Admin"); // Realtime Database reference
          await push(uploadsRef, {
            name: name, // Save the name
            description: description, // Save the description
            category: selectedCategory, // Save the category
            file: url,  // Save the file URL
            uploadedAt: new Date().toISOString(),
          });
          setUploadStatus("File, name, description, and category saved to Realtime Database");

          // Clear input fields after successful upload
          handleReset();
        } catch (error) {
          console.error("Error saving to Realtime Database:", error);
          setUploadStatus("Error saving to Realtime Database");
        }
      }
    );
  };

  // Handle resetting the form fields
  const handleReset = () => {
    setName("");
    setDescription("");
    setSelectedCategory("");
    setSelectedFile(null);
    setUploadStatus("");

    // Reset the file input field using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Render the component only after hydration
  if (!isMounted) return null;

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Upload File To HEX Open Data Portal</h3>

      <div className="mb-3">
        <label className="form-label">Title:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter the file title"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description:</label>
        <ReactQuill
          value={description}
          onChange={handleDescriptionChange}
          theme="snow" // Choose theme here
          className="border"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange} className="form-select">
          <option value="">Select an option</option>
          <option value="Transportation">Transportation</option>
          <option value="Community">Community</option>
          <option value="School">School</option>
          <option value="Employment">Employment</option>
          <option value="Public Safety">Public Safety</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">File (CSV, HTML, XLSX, RDF):</label>
        <input
          type="file"
          accept=".csv,.html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.rdf"
          onChange={handleFileChange}
          ref={fileInputRef} // Use the ref to clear the field
          className="form-control"
        />
      </div>

      <div className="d-flex justify-content-between">
        <button onClick={handleFileUpload} className="btn btn-primary">Upload</button>
        <button onClick={handleReset} className="btn btn-secondary">Start Over</button>
      </div>

      {/* Status message */}
      {uploadStatus && <p className="mt-3 text-danger">{uploadStatus}</p>}
    </div>
  );
};

export default AdminPortal;
