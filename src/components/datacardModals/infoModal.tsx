"use client";

import React from "react";
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
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-CA");
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return "";
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{fileData?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fileData ? (
          <Tab.Container defaultActiveKey="info">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="details">Data</Nav.Link>
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
            </Tab.Content>
          </Tab.Container>
        ) : (
          <p>No file information available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
