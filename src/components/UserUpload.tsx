"use client";
import React, { useState, useRef } from "react";
import { storage, database } from "../../.firebase/firebase"; // Replace firestoreDb with database
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database"; // Realtime Database methods
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const UserUpload: React.FC = () => {
  const [name, setName] = useState<string>(""); // New state for name
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [downloadURL, setDownloadURL] = useState<string>("");

  // Ref for the file input to reset it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Handle file upload
  const handleFileUpload = async () => {
    if (!name) {
      setUploadStatus("Please enter a title");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("No file selected");
      return;
    }

    // Create a storage reference in Firebase Storage
    const storageRef = ref(storage, `AI/${selectedFile.name}`);

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
          const uploadsRef = dbRef(database, "AI"); // Realtime Database reference
          await push(uploadsRef, {
            name: name, // Save the name
            file: url, // Save the file URL
            uploadedAt: new Date().toISOString(),
          });
          setUploadStatus("File and Title saved to Realtime Database");

          // Clear input fields after successful upload
          handleReset();
        } catch (error) {
          console.error("Error saving to Realtime Database:", error);
          setUploadStatus("Error saving file and title to Realtime Database");
        }
      }
    );
  };

  // Handle resetting the form fields
  const handleReset = () => {
    setName("");
    setSelectedFile(null);
    setUploadStatus("");
    setDownloadURL("");

    // Reset the file input field using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container bg-dark text-white p-5 rounded">
      <h3 className="mb-4 text-center">Upload File to Uncle HEX</h3>

      {/* Name input */}
      <div className="form-group">
        <label htmlFor="fileTitle" className="form-label">Title:</label>
        <input
          type="text"
          id="fileTitle"
          className="form-control bg-secondary text-white"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter file title"
        />
      </div>

      {/* File input */}
      <div className="form-group mt-3">
        <label htmlFor="fileInput" className="form-label">File (CSV, HTML, XLSX, RDF):</label>
        <input
          type="file"
          id="fileInput"
          className="form-control bg-secondary text-white"
          accept=".csv,.html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.rdf"
          onChange={handleFileChange}
          ref={fileInputRef} // Use the ref to clear the field
        />
      </div>

      {/* Upload button */}
      <button
        onClick={handleFileUpload}
        className="btn btn-primary mt-4"
        disabled={!selectedFile || !name}
      >
        Upload
      </button>

      {/* Start Over button */}
      <button
        onClick={handleReset}
        className="btn btn-outline-light mt-4 ml-3"
        style={{ marginLeft: "10px" }}
      >
        Start Over
      </button>

      {/* Status message */}
      {uploadStatus && (
        <p className="mt-3 alert alert-info">{uploadStatus}</p>
      )}

      {/* Show download link if available */}
      {downloadURL && (
        <div className="mt-3">
          <a href={downloadURL} className="btn btn-success">
            Download File
          </a>
        </div>
      )}
    </div>
  );
};

export default UserUpload;
