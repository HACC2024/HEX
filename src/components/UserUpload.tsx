"use client";
import React, { useState, useRef } from "react";
import { storage, database } from "../../.firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database";
import { Upload, RefreshCw, AlertCircle } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";

const UserUpload: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const acceptedTypes = [
        "text/csv",
        "application/rdf+xml",
        "application/json",
        "application/xml",
        "text/xml"
      ];

      if (acceptedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadStatus(""); // Clear any previous error messages
      } else {
        setSelectedFile(null);
        setUploadStatus("Only CSV, JSON, XML, and RDF files are allowed");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!name.trim()) {
      setUploadStatus("Please enter a title");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("No file selected");
      return;
    }

    setIsUploading(true);
    const storageRef = ref(storage, `AI/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadStatus(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploadStatus("Error uploading file");
        setIsUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const uploadsRef = dbRef(database, "AI");
          await push(uploadsRef, {
            name: name.trim(),
            file: url,
            uploadedAt: new Date().toISOString(),
          });
          setUploadStatus("File uploaded successfully!");
          handleReset();
        } catch (error) {
          console.error("Error saving to database:", error);
          setUploadStatus("Error saving file information");
        }
        setIsUploading(false);
      }
    );
  };

  const handleReset = () => {
    setName("");
    setSelectedFile(null);
    setUploadStatus("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <Upload className="text-primary me-2" size={24} />
          <h3 className="m-0" style={{ color: '#2563eb' }}>Upload to Uncle HEX</h3>
        </div>

        <div className="mb-3">
          <label htmlFor="fileTitle" className="form-label text-muted">
            Title
          </label>
          <input
            type="text"
            id="fileTitle"
            className="form-control"
            value={name}
            onChange={handleNameChange}
            placeholder="Give your file a title"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: '#2c3e50'
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fileInput" className="form-label text-muted">
            File (CSV, JSON, XML, RDF)
          </label>
          <input
            type="file"
            id="fileInput"
            className="form-control"
            accept=".csv,.json,.xml,.rdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: '#2c3e50'
            }}
          />
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={handleFileUpload}
            className="btn btn-primary d-flex align-items-center"
            disabled={!selectedFile || !name || isUploading}
          >
            {isUploading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="me-2" />
                Upload File
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-outline-secondary d-flex align-items-center"
          >
            <RefreshCw size={18} className="me-2" />
            Clear Form
          </button>
        </div>

        {uploadStatus && (
          <div className={`alert ${
            uploadStatus.includes('Error') ? 'alert-danger' : 
            uploadStatus.includes('success') ? 'alert-success' : 'alert-info'
          } d-flex align-items-center mt-3`}
          >
            <AlertCircle size={18} className="me-2" />
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUpload;