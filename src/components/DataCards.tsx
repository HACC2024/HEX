"use client";

import React, { useState, useEffect } from "react";
import { Image, Modal, Button, Nav, Tab } from "react-bootstrap";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../.firebase/firebase";
import { Download } from "react-bootstrap-icons";
import "../styles/DataCard.css";

interface FileData {
  name: string;
  file: { [key: string]: string[] };
  description: string;
  category: string;
  image: string;
}

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [currentFileOptions, setCurrentFileOptions] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(
    null
  );

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

  const openDownloadModal = (fileOptions: { [key: string]: string[] }) => {
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
    setShowDownloadModal(true);
  };

  const openInfoModal = (fileData: FileData) => {
    setSelectedFileData(fileData);
    setShowInfoModal(true);
  };

  const closeDownloadModal = () => {
    setShowDownloadModal(false);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
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
    closeDownloadModal();
  };

  return (
    <div>
      <h1>Download CSV Files for {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {files.map((file: FileData) => (
            <div
              key={file.name}
              className="file-card"
              onClick={() => openInfoModal(file)}
            >
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
                    e.stopPropagation();
                    openDownloadModal(file.file);
                  }}
                  className="download-button"
                >
                  Download <Download />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <Modal
        show={showInfoModal}
        onHide={closeInfoModal}
        centered
        dialogClassName="fixed-size-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedFileData?.name}</Modal.Title> {}
        </Modal.Header>
        <Modal.Body>
          {selectedFileData ? (
            <Tab.Container defaultActiveKey="info">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="info">Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="details">Graphs</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <p>...</p>
                </Tab.Pane>
                <Tab.Pane eventKey="details">
                  <p>...</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          ) : (
            <p>No file information available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeInfoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {}
      <Modal
        show={showDownloadModal}
        onHide={closeDownloadModal}
        centered
        dialogClassName="fixed-size-modal"
      >
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
          <Button variant="secondary" onClick={closeDownloadModal}>
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
