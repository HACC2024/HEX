/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { fetchUncleHexResponse } from "../app/api";
import { database, storage } from "../../.firebase/firebase"; // Import storage
import { ref, onValue } from "firebase/database";
import { ref as storageRef, getBlob } from "firebase/storage"; // Import storage functions
import Select from "react-select";
import UserUpload from "./UserUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UncleChatbot.css";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; // Add these imports
import { MessageSquare, Upload, HelpCircle, Send, XCircle } from 'lucide-react';

const UncleChatbot: React.FC = () => {
  const [question, setQuestion] = useState<string>(""); // User's query
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error handling
  const [fileNames, setFileNames] = useState<
    { label: string; value: string }[]
  >([]); // Available files
  const [selectedFile, setSelectedFile] = useState<{
    label: string;
    value: string;
  } | null>(null); // Selected file
  const [fetchedFile, setFetchedFile] = useState<File | null>(null); // Fetched file to be submitted
  const [chatHistory, setChatHistory] = useState<
    { question: string; response: string | null }[]
  >([]); // Chat history
  const [showInstructions, setShowInstructions] = useState<boolean>(false); // Toggle instructions
  const [showUpload, setShowUpload] = useState<boolean>(false); // Toggle instructions
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch available files from Firebase Realtime Database and parse them for the select dropdown
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Modify the files fetch useEffect to depend on currentUser
  useEffect(() => {
    // Only fetch files if user is authenticated
    if (!currentUser) {
      setFileNames([]);
      return;
    }

    const fileRef = ref(database, "AI");

    const unsubscribe = onValue(fileRef, async (snapshot) => {
      const files = snapshot.val();
      if (files) {
        const parsedFiles = Object.keys(files).map((key) => {
          const fileName = extractFileNameFromURL(files[key].file);
          return {
            label: `${files[key].name} - ${fileName}`,
            value: fileName,
          };
        });
        setFileNames(parsedFiles);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      background: "#f8fafc",
      borderColor: "rgba(37, 99, 235, 0.2)",
      "&:hover": {
        borderColor: "#2563eb"
      }
    }),
    option: (base: any, state: { isSelected: any; }) => ({
      ...base,
      background: state.isSelected ? "#2563eb" : "white",
      "&:hover": {
        background: state.isSelected ? "#2563eb" : "#f8fafc"
      }
    })
  };

  // Extract the file name from its URL
  const extractFileNameFromURL = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    return fileNameWithParams?.split("?")[0] || "";
  };

  // Fetch the file directly from Firebase Storage as a Blob and convert it to a File object
  const fetchFileFromStorage = async (
    fileName: string
  ): Promise<File | null> => {
    try {
      const fileStorageRef = storageRef(storage, `AI/${fileName}`);
      const blob = await getBlob(fileStorageRef); // Fetch the file as a Blob

      // Convert the Blob to a File object
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error fetching file from Firebase Storage:", error);
      return null;
    }
  };

  // Handle file selection from dropdown and fetch the file immediately
  const handleFileSelection = async (
    file: { label: string; value: string } | null
  ) => {
    setSelectedFile(file);

    if (file) {
      const fetchedFile = await fetchFileFromStorage(file.value); // Fetch the file from Firebase Storage
      setFetchedFile(fetchedFile); // Store the fetched file for preview and submission
    } else {
      setFetchedFile(null); // Clear if no file selected
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let fullQuery = `Question: ${question}`;
      let fileToSubmit: File | null = null;

      if (fetchedFile && selectedFile) {
        fileToSubmit = fetchedFile; // Submit the fetched file as a File object
        fullQuery = `File Title: ${selectedFile.label}. ${question}`;
      }

      const response = await fetchUncleHexResponse(fullQuery, fileToSubmit);
      setChatHistory((prev) => [
        ...prev,
        { question, response: response || "No response" },
      ]);
      setQuestion(""); // Clear input after submission
    } catch (err) {
      setError("An error occurred while fetching the response.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat entry
  const handleDelete = (index: number) => {
    setChatHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chatbox container mt-4 p-4 rounded shadow">
      <div className="d-flex flex-column align-items-center mb-4">
        <h3 className="d-flex align-items-center gap-2">
          <MessageSquare size={24} />
          Chat with Uncle HEX
        </h3>
        
        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? <XCircle size={18} /> : <Upload size={18} />}
            {showUpload ? "Hide Uploads" : "Upload a File"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <HelpCircle size={18} />
            {showInstructions ? "Hide Help" : "Need Help?"}
          </button>
        </div>

        {showUpload && (
          <div className="upload-section mt-4 w-100">
            <UserUpload />
          </div>
        )}
      </div>

      {showInstructions && (
        <div className="instructions-panel">
          <h4 className="mb-3">Quick Guide</h4>
          <ol className="instruction-list">
            <li>For the best results, filter your data with the HEX CSV Data Visualizer and Cleaner—better data, sharper insights!</li>
            <li>Upload or select a file to analyze, or just chat directly with Uncle HEX</li>
            <li>Ask questions about your data or any topic you would like to discuss</li>
            <li>Get detailed responses and insights from Uncle HEX</li>
          </ol>
        </div>
      )}

      <div className="chat-history">
        {chatHistory.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={40} className="text-muted mb-3" />
            <h4>Howzit! Jus tell Uncle wat you need help wit!</h4>
            <p className="text-muted">Can ask me about your data or jus talk story. No shame, ask away! But if get one error, no blame me—might be cause yo data stay too big!</p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="chat-entry">
              <div className="d-flex justify-content-between align-items-start">
                <p className="user-message">
                  <strong>You:</strong> {chat.question}
                </p>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete message"
                >
                  <XCircle size={16} />
                </button>
              </div>
              <div className="assistant-message mt-2">
                <span dangerouslySetInnerHTML={{ __html: chat.response || "" }} />
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="chatbox-form mt-4">
        <div className="input-group mb-3">
          <Select
            options={fileNames}
            value={selectedFile}
            onChange={handleFileSelection}
            placeholder="Search and select a file to analyze"
            className="file-select"
            isClearable
            styles={selectStyles}
          />
        </div>

        <div className="message-input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Uncle HEX anything..."
            required
            className="form-control"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary d-flex align-items-center gap-2 mt-3"
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send to Uncle HEX</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger mt-3 d-flex align-items-center gap-2">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default UncleChatbot;