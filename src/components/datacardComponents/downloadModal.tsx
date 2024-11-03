"use client";

import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

interface DownloadModalProps {
  show: boolean;
  onHide: () => void;
  fileOptions: { [key: string]: string[] };
  selectedFile: string;
  setSelectedFile: (file: string) => void;
  handleDownload: () => void;
  extractFileNameFromURL: (url: string) => string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  show,
  onHide,
  fileOptions,
  selectedFile,
  setSelectedFile,
  handleDownload,
  extractFileNameFromURL,
}) => {
  const handleClose = () => {
    setSelectedFile("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="fixed-size-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Select a File to Download</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(fileOptions).length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>File Type</th>
                  <th>File Names</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(fileOptions).map((key) =>
                  fileOptions[key].map((url, index) => (
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
                  ))
                )}
              </tbody>
            </Table>
            {selectedFile && (
              <p className="selected-file">
                Selected File: {extractFileNameFromURL(selectedFile)}
              </p>
            )}
          </>
        ) : (
          <p>No available files for download.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
  );
};

export default DownloadModal;
