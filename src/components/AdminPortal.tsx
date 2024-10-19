"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import { storage, database } from "../firebase"; // Replace firestoreDb with database
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database"; // Realtime Database methods

// Dynamically import JoditEditor and disable SSR
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [description, setDescription] = useState<string>(""); // New state for description
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for dropdown
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [downloadURL, setDownloadURL] = useState<string>("");

  // Ref for the file input to reset it
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editor = useRef(null); // Ref for Jodit Editor

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

  // Handle description input change (Jodit Editor)
  const handleDescriptionChange = (newContent: string) => {
    setDescription(newContent);
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
    const storageRef = ref(storage, `uploads/${selectedFile.name}`);

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
        setDownloadURL(url);
        setUploadStatus("File uploaded successfully");

        // Save the file info along with the name, description, and category to Realtime Database
        try {
          const uploadsRef = dbRef(database, "uploads"); // Realtime Database reference
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
    setDownloadURL("");

    // Reset the file input field using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h3>Upload File To HEX Open Data Portal</h3>

      {/* Title input */}
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter the file title"
        />
      </div>

      {/* Description input with Jodit Editor */}
      <div>
        <label>Description:</label>
        <JoditEditor
          ref={editor}
          value={description}
          onBlur={handleDescriptionChange}
        />
      </div>

      {/* Category dropdown */}
      <div>
        <label>Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select an option</option>
          <option value="Transportation">Transportation</option>
          <option value="Community">Community</option>
          <option value="School">School</option>
          <option value="Employment">Employment</option>
          <option value="Public Safety">Public Safety</option>
          {/* Add more options as needed */}
        </select>
      </div>

      {/* File input */}
      <div>
        <label>File (CSV, HTML, XLSX, RDF):</label>
        <input
          type="file"
          accept=".csv,.html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.rdf"
          onChange={handleFileChange}
          ref={fileInputRef} // Use the ref to clear the field
        />
      </div>

      {/* Upload button */}
      <button onClick={handleFileUpload}>Upload</button>

      {/* Start Over button */}
      <button onClick={handleReset} style={{ marginLeft: "10px" }}>Start Over</button>

      {/* Status message */}
      <p>{uploadStatus}</p>

      {/* Show download link if available */}
      {downloadURL && <a href={downloadURL}>Download File</a>}
    </div>
  );
};

export default AdminPortal;
