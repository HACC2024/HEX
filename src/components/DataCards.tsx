"use client";

import React, { useState, useEffect } from "react";
import { Image, Modal, Button } from "react-bootstrap";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../.firebase/firebase";
import { Download } from "react-bootstrap-icons";
import "../styles/DataCard.css";
import Link from "next/link";

interface FileData {
  name: string;
  file: { [key: string]: string[] };
  category: string;
  image: string;
}

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [currentFileOptions, setCurrentFileOptions] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const dbRefPath = dbRef(database, "Admin");

    const unsubscribe = onValue(
      dbRefPath,
      (snapshot) => {
        if (snapshot.exists()) {
          const fileList = snapshot.val();

          const filteredFiles: FileData[] = Object.keys(fileList)
            .map((key) => ({
              name: fileList[key].name,
              file: fileList[key].file,
              image: fileList[key].image,
              category: fileList[key].category,
            }))
            .filter((file: FileData) => file.category === category);

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

  const extractFileNameFromURL = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    const fileName = fileNameWithParams?.split("?")[0];
    return fileName || "";
  };

  const openModal = (fileOptions: { [key: string]: string[] }) => {
    const filteredOptions = Object.keys(fileOptions)
      .filter(
        (key) =>
          fileOptions[key].length > 0 &&
          fileOptions[key].every((url) => url !== "")
      )
      .reduce((obj, key) => {
        obj[key] = fileOptions[key];
        return obj;
      }, {} as { [key: string]: string[] });

    setCurrentFileOptions(filteredOptions);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDownload = () => {
    if (!selectedFile) {
      alert("No file selected for download.");
      return;
    }

    const a = document.createElement("a");
    a.href = selectedFile;
    a.download = selectedFile.split("/").pop() || "file";
    document.body.appendChild(a);
    a.click();
    a.remove();

    alert(`Downloading ${a.download}`);
    closeModal();
  };

  return (
    <div>
      <h1>Download CSV Files for {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {files.map((file: FileData) => (
            <Link
              key={file.name}
              href={`/Datapage/${encodeURIComponent(file.name)}`}
              passHref
            >
              <div className="file-card">
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
                    {Object.keys(file.file).map((key) =>
                      file.file[key].length > 0 &&
                      file.file[key].some((url) => url !== "") ? (
                        <span
                          key={key}
                          className="file-tag"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {key}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
                <div className="button-container">
                  <div className="button-border"></div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(file.file);
                    }}
                    className="download-button"
                  >
                    Download <Download />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select a File to Download</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(currentFileOptions).length > 0 ? (
            Object.keys(currentFileOptions).map((key) =>
              currentFileOptions[key].map((url, index) => (
                <Button
                  key={index}
                  variant={selectedFile === url ? "primary" : "outline-primary"}
                  onClick={() => setSelectedFile(url)}
                  className={`file-option-button ${
                    selectedFile === url ? "selected" : ""
                  }`}
                  style={{ width: "100%" }}
                >
                  {`${key} - ${extractFileNameFromURL(url)}`}
                </Button>
              ))
            )
          ) : (
            <p>No files available for download.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={!selectedFile}
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DownloadCSVFiles;
