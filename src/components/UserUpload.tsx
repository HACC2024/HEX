/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useRef, useEffect } from "react";
import { storage, database, auth } from "../../.firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, get, push, set } from "firebase/database";
import { Upload, RefreshCw, AlertCircle, LogOut } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import ReCAPTCHA from 'react-google-recaptcha';


const UserUpload: React.FC = () => {
  // Auth states
  const [user, setUser] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [displayName, setDisplayName] = useState(""); // Add this state

  // Upload states
  const [name, setName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //Captcha
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await recaptchaRef.current?.getValue();
      if (!token) {
        setAuthError("Please complete the reCAPTCHA verification.");
        return;
      }
      // Basic validation
      if (!displayName.trim()) {
        setAuthError("Display name is required");
        return;
      }

      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user: newUser } = userCredential;

      // Create user record in database with all required fields
      const userRef = dbRef(database, `users/${newUser.uid}`);
      await set(userRef, {
        uid: newUser.uid,
        email: newUser.email,
        displayName: displayName.trim(),
        role: "user", // default role
        createdAt: new Date().toISOString(),
      });

      setEmail("");
      setPassword("");
      setDisplayName("");
      recaptchaRef.current?.reset();
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await recaptchaRef.current?.getValue();
      if (!token) {
        setAuthError("Please complete the reCAPTCHA verification.");
        return;
      }
      setAuthError("");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check user status in database
      const userRef = dbRef(database, `users/${userCredential.user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
  
      // Check if account is deactivated
      if (userData.status === 'deactivated' || userData.active === false) {
        await signOut(auth);
        setAuthError("This account has been deactivated. Please contact an administrator.");
        return;
      }
  
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleReset();
    } catch (error: any) {
      console.error("Error signing out:", error);
    }
  };

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
        "text/xml",
      ];

      if (acceptedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadStatus("");
      } else {
        setSelectedFile(null);
        setUploadStatus("Only CSV, JSON, XML, and RDF files are allowed");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!user) {
      setUploadStatus("Please sign in to upload files");
      return;
    }

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
            userId: user.uid,
            userEmail: user.email,
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

  if (!user) {
    return (
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-center mb-2" style={{ color: "#2563eb" }}>
            {isRegistering
              ? "Create a New Account"
              : "Log In To Use This Feature"}
          </h3>
          <span className="text-muted d-block text-center mb-4">
            {isRegistering
              ? "It's quick and easy"
              : "Sign in to upload and analyze files"}
          </span>

          {authError && (
            <div className="alert alert-danger d-flex align-items-center">
              <AlertCircle size={18} className="me-2" />
              {authError}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                    color: "#2c3e50",
                  }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  color: "#2c3e50",
                }}
              />
            </div>

            <ReCAPTCHA className= "py-3"
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            />

            <button type="submit" className="btn btn-primary w-100">
              {isRegistering ? "Register" : "Login"}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? "Already have an account? Log in here"
                  : "Need an account? Register here"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Upload className="text-primary me-2" size={24} />
            <div>
              <small className="text-muted d-block">
                Welcome, {auth.currentUser?.email || "User"}
              </small>
              <h3 className="m-0" style={{ color: "#2563eb" }}>
                Upload to Uncle HEX
              </h3>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger d-flex align-items-center"
          >
            <LogOut size={18} className="me-2" />
            Sign Out
          </button>
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
              backgroundColor: "#f8fafc",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              color: "#2c3e50",
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
              backgroundColor: "#f8fafc",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              color: "#2c3e50",
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
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
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
          <div
            className={`alert ${
              uploadStatus.includes("Error")
                ? "alert-danger"
                : uploadStatus.includes("success")
                ? "alert-success"
                : "alert-info"
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