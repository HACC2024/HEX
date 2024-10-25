import React, { useState, useEffect } from "react";
import { fetchUncleHexResponse } from "../app/api";
import { database, storage } from "../../.firebase/firebase"; // Import storage
import { ref, onValue } from "firebase/database";
import { ref as storageRef, getBlob } from "firebase/storage"; // Import storage functions
import Select from "react-select";
import UserUpload from "./UserUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UncleChatbot.css";

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

  // Fetch available files from Firebase Realtime Database and parse them for the select dropdown
  useEffect(() => {
    const fileRef = ref(database, "AI");

    onValue(fileRef, async (snapshot) => {
      const files = snapshot.val();
      if (files) {
        const parsedFiles = Object.keys(files).map((key) => {
          const fileName = extractFileNameFromURL(files[key].file);
          return {
            label: `${files[key].name} - ${fileName}`,
            value: fileName, // Store the actual file name instead of the URL
          };
        });
        setFileNames(parsedFiles);
      }
    });
  }, []);

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
    <div className="chatbox container mt-4 p-4 bg-dark rounded shadow">
      <div className="d-flex flex-column align-items-center mb-4">
        <h3>Uncle HEX Chatbot</h3>
        {showUpload && (
          <div className="mt-4 p-3 mb-3 border bg-secondary rounded">
            <UserUpload />
          </div>
        )}
        <button
          type="button"
          className="btn btn-info mx-2 btn-sm"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? "Hide Uploads" : "Upload a File"}
        </button>
      </div>
      <div className="chat-history mt-4">
        {chatHistory.length === 0 ? (
          <div className="empty-chatbox-message text-center py-5">
            <h4>
              Howzit? Jus tell Uncle wat you need help wit! No shame, ask away!
            </h4>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div
              key={index}
              className="chat-entry border-bottom py-3 position-relative"
            >
              <p>
                <strong>You:</strong> {chat.question}
              </p>
              <span dangerouslySetInnerHTML={{ __html: chat.response || "" }} />
              <button
                className="btn btn-danger position-absolute top-0 end-0"
                onClick={() => handleDelete(index)}
              >
                -
              </button>
            </div>
          ))
        )}
      </div>

      {showInstructions && (
        <div className="mt-4 p-3 mb-3 border bg-secondary rounded">
          <h3>Instructions</h3>
          <p>1. Upload and Select a file or ask about Uncle HEX right away.</p>
          <p>2. Uncle HEX will analyze the file or talk story with you.</p>
          <p>3. Enter your question and click Send to Uncle HEX.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chatbox-form">
        <div className="input-group mb-3">
          <div className="flex-grow-1">
            <Select
              options={fileNames}
              value={selectedFile}
              onChange={handleFileSelection}
              placeholder="Search and select a file"
              className="file-search-dropdown text-dark"
              isClearable
            />
          </div>
          <button
            type="button"
            className="btn btn-info mx-2 btn-sm"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? "Hide Instructions" : "See Instructions"}
          </button>
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            value={question}
            placeholder="Ask Uncle HEX..."
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="form-control bg-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? "Sending..." : "Send to Uncle HEX"}
        </button>
      </form>

      {error && <p className="alert alert-danger mt-4">Error: {error}</p>}
    </div>
  );
};

export default UncleChatbot;
