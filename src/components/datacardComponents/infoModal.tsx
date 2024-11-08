"use client";

import React, { useState, useEffect } from "react";
import { Modal, Tab, Nav, Row, Col, Table, Button } from "react-bootstrap";
import dynamic from "next/dynamic";
import "./modal.css";

export interface FileData {
  name: string;
  file: { [key: string]: string[] };
  category: string;
  image: string;
  description: string;
  uploadedAt: string;
  updatedAt: string;
  author: string;
  maintainer: string;
  department: string;
  views: number;
}

interface InfoModalProps {
  show: boolean;
  onHide: () => void;
  fileData: FileData | null;
}

const CsvReaderAuto = dynamic(() => import("../csvAuto/CsvReaderAuto"), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "300px" }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-3 mx-auto"></div>
        <p>Loading CSV Visualizer...</p>
      </div>
    </div>
  ),
});

const InfoModal: React.FC<InfoModalProps> = ({ show, onHide, fileData }) => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("info");

  useEffect(() => {
    if (!show) {
      setSelectedFile("");
      setActiveTab("info");
    }
  }, [show]);

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-CA");
  };

  const handleFileDownload = () => {
    if (!selectedFile) return;

    const a = document.createElement("a");
    a.href = selectedFile;
    a.download = selectedFile.split("/").pop() || "file";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const extractFileNameFromURL = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    return parts.pop()?.split("?")[0] || "";
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton  className="custom-modal-header">
        <Modal.Title>{fileData?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        {fileData ? (
          <Tab.Container
            defaultActiveKey="info"
            onSelect={(k) => setActiveTab(k || "info")}
          >
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="details">Data</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="download">Download</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Row>
                  <Col>
                    <p className="pt-3">
                      <strong>Dataset Description</strong>
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fileData.description,
                      }}
                    />
                  </Col>
                  <Col>
                    <p className="pt-3">
                      <strong>Additional Information</strong>
                    </p>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Author</td>
                          <td>{fileData.author}</td>
                        </tr>
                        <tr>
                          <td>Maintainer</td>
                          <td>{fileData.maintainer}</td>
                        </tr>
                        <tr>
                          <td>Department</td>
                          <td>{fileData.department}</td>
                        </tr>
                        <tr>
                          <td>Last Updated</td>
                          <td>{formatDate(fileData.updatedAt)}</td>
                        </tr>
                        <tr>
                          <td>Uploaded At</td>
                          <td>{formatDate(fileData.uploadedAt)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="details">
                <CsvReaderAuto file={fileData.file} />
              </Tab.Pane>
              <Tab.Pane eventKey="download">
                <Row className="pt-3">
                  <Col>
                    {Object.keys(fileData.file).length > 0 ? (
                      <>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>File Type</th>
                              <th>File Names</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(fileData.file).map(
                              (key) =>
                                key &&
                                fileData.file[key].length > 0 &&
                                fileData.file[key].map(
                                  (url, index) =>
                                    url && (
                                      <tr key={`${key}-${index}`}>
                                        <td>{key}</td>
                                        <td>
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setSelectedFile(url);
                                            }}
                                          >
                                            {extractFileNameFromURL(url)}
                                          </a>
                                        </td>
                                      </tr>
                                    )
                                )
                            )}
                          </tbody>
                        </Table>
                        {selectedFile && (
                          <p className="selected-file">
                            Selected File:{" "}
                            {extractFileNameFromURL(selectedFile)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p>No available files for download.</p>
                    )}
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        ) : (
          <p>No file information available.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {activeTab === "download" && (
          <Button
            variant="primary"
            onClick={handleFileDownload}
            disabled={!selectedFile}
          >
            Download
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
