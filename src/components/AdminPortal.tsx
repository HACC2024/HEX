"use client";
import React, { useState } from "react";
import { storage, database } from "../firebase"; // Replace firestoreDb with database
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database"; // Realtime Database methods

const AdminPortal: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [downloadURL, setDownloadURL] = useState<string>("");

  // Handle file input change (CSV file validation)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        setUploadStatus("Only CSV files are allowed");
      }
    }
  };

  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!name) {
      setUploadStatus("Please enter a name");
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

        // Save the file info along with the name to Realtime Database
        try {
          const uploadsRef = dbRef(database, "uploads"); // Realtime Database reference
          await push(uploadsRef, {
            name: name, // Save the name
            file: url,  // Save the file URL
            uploadedAt: new Date().toISOString(),
          });
          setUploadStatus("File and name saved to Realtime Database");
        } catch (error) {
          console.error("Error saving to Realtime Database:", error);
          setUploadStatus("Error saving file and name to Realtime Database");
        }
      }
    );
  };

  return (
    <div>
      <h1>Upload File</h1>

      {/* Name input */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>

      {/* File input */}
      <div>
        <label>CSV File:</label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* Upload button */}
      <button onClick={handleFileUpload}>Upload</button>

      {/* Status message */}
      <p>{uploadStatus}</p>

      {/* Show download link if available */}
      {downloadURL && <a href={downloadURL}>Download File</a>}
    </div>
  );
};

export default AdminPortal;
