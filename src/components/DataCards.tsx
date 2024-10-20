"use client";
import React, { useState, useEffect } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../firebase"; // Use the initialized database

const DownloadCSVFiles: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; file: string }[]>([]);
  const [loading, setLoading] = useState(true); // Start as loading

  useEffect(() => {
    const dbRefPath = dbRef(database, "Admin"); // Reference to the uploads path

    // Set up a listener for real-time updates
    const unsubscribe = onValue(
      dbRefPath,
      (snapshot) => {
        if (snapshot.exists()) {
          const fileList = snapshot.val();

          const filesArray = Object.keys(fileList).map((key) => ({
            name: fileList[key].name,
            file: fileList[key].file,
          }));

          setFiles(filesArray);
        } else {
          console.log("No data available");
          setFiles([]); // Clear files if no data
        }
        setLoading(false); // Set loading to false after fetching
      },
      (error) => {
        console.error("Error fetching files:", error);
        setLoading(false); // Ensure loading is false on error
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const downloadFile = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName; // Use the provided file name
    document.body.appendChild(a);
    a.click();
    a.remove();

    alert(`Downloading ${fileName}`);
  };

  return (
    <div>
      <h1>
        Download {category.charAt(0).toUpperCase() + category.slice(1)} CSV
        Files
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cards-container">
          {files.map((file) => (
            <div key={file.file} className="data-card">
              <img
                src="https://via.placeholder.com/150"
                alt={file.name}
                className="data-card-image"
              />
              <h3 className="data-card-title">{file.name}</h3>
              <button
                className="data-card-download"
                onClick={() => downloadFile(file.file, file.name)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadCSVFiles;
