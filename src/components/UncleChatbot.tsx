import React, { useState, useEffect } from "react";
import { fetchUncleHexResponse } from "../app/api";
import { database } from "../../.firebase/firebase";
import { ref, onValue } from "firebase/database";
import Select from "react-select";
import UserUpload from "./UserUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UncleChatbot.css";

const UncleChatbot: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { question: string; response: string | null }[]
  >([]);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState<boolean>(false);

  useEffect(() => {
    const fileRef = ref(database, "AI");
    onValue(fileRef, (snapshot) => {
      const files = snapshot.val();
      if (files) {
        const parsedFiles = Object.keys(files).map((key) => {
          const fileName = extractFileNameFromURL(files[key].file);
          return {
            label: `${files[key].name} - ${fileName}`,
            value: files[key].file,
          };
        });
        setFileNames(parsedFiles);
      }
    });
  }, []);

  const extractFileNameFromURL = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    const fileName = fileNameWithParams?.split("?")[0];
    return fileName || "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let fullQuery = "";

      if (selectedFile) {
        fullQuery = `If a File Title and Specific File is specified, you don't need to remind the user to upload any file. File Title: ${selectedFile.label} + Specific File: ${selectedFile.value} + Read this file and tell me about it in detail, including its columns, the types of data it contains, any numerical data, and any other relevant information like percentages, statistics, and its importance. My specific question is: ${question}`;
      } else {
        fullQuery = `Question: ${question}`;
      }

      const result = await fetchUncleHexResponse(fullQuery);

      setChatHistory((prev) => [
        ...prev,
        { question: question, response: result },
      ]);

      setQuestion("");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    setChatHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chatbox container mt-4 p-4 bg-dark rounded shadow">
      {showUpload && <UserUpload />}

      <h3 className="mb-4 text-center">Uncle HEX Chatbot</h3>

      <div className="chat-history mt-4">
        {chatHistory.length === 0 ? (
          <div className="empty-chatbox-message text-center py-5">
            <h4>
              Howzit? Jus tell Uncle wat you need help wit! No shame, ask
              away!
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
              <p>
                <span
                  dangerouslySetInnerHTML={{ __html: chat.response || "" }}
                />
              </p>
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
          <p>1. Select a file or ask any question.</p>
          <p>2. If a file is selected, Uncle HEX will analyze it.</p>
          <p>3. Enter your question and click Send to Uncle HEX.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chatbox-form">
        <div className="input-group mb-3">
          <div className="flex-grow-1">
            <Select
              options={fileNames}
              value={selectedFile}
              onChange={setSelectedFile}
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
          <button
            type="button"
            className="btn btn-info mx-2 btn-sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? "Hide Upload" : "Upload a File"}
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
