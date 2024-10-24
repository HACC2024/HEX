'use client';

import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../.firebase/firebase";
import { Download } from "react-bootstrap-icons";
import "../styles/DataCard.css";

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<
    { name: string; file: string; category: string; image: string; }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRefPath = dbRef(database, "Admin");

    const unsubscribe = onValue(
      dbRefPath,
      (snapshot) => {
        if (snapshot.exists()) {
          const fileList = snapshot.val();

          // Filter files by category
          const filteredFiles = Object.keys(fileList)
            .map((key) => ({
              name: fileList[key].name,
              file: fileList[key].file, 
              image: fileList[key].image,
              category: fileList[key].category,
            }))
            .filter((file) => file.category === category);

          setFiles(filteredFiles);
        } else {
          console.log("No data available");
          setFiles([]);
        }
        setLoading(false); 
      },
      (error) => {
        console.error("Error fetching files:", error);
        setLoading(false); 
      }
    );

    return () => unsubscribe();
  }, [category]); 

  const downloadFile = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName; 
    document.body.appendChild(a);
    a.click();
    a.remove();

    alert(`Downloading ${fileName}`);
  };

  return (
    <div>
      <h1>Download CSV Files for {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.file} className="file-card">
              <div className="justify-content-center">
                <Image
                  src={file.image}
                  alt="DataCard Image"
                  className="card-image"
                />
              </div>
              <div className="file-info">
                <h3 className="file-name">{file.name}</h3>
                <p className="file-category">{file.category}</p>
                <div className="file-tags pt-2">
                  {}
                  {Object.keys(file.file).map((key, index) => (
                    <span key={index} className="file-tag">
                      {key} {}
                    </span>
                  ))}
                </div>
              </div>
              <div className="button-container">
                <div className="button-border"></div>
                <button
                  onClick={() => downloadFile(file.file, file.name)}
                  className="download-button"
                >
                  Download <Download />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadCSVFiles;
