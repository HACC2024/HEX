"use client";

import React, { useState, useEffect } from "react";
import { Image, Dropdown, DropdownButton, Nav } from "react-bootstrap";
import { Trash, Bookmark } from "react-bootstrap-icons";
import InfoModal from "../datacardComponents/infoModal";
import ProjectInfoModal from "../projectcardComponents/infoModal";
import "./bookmark.css";

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
  type?: string;
}

const BookmarkDropdown: React.FC = () => {
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileData[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showProjectInfoModal, setShowProjectInfoModal] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"datasets" | "projects" | "other">(
    "other"
  );
  const [show, setShow] = useState(false);

  const loadBookmarks = () => {
    const storedBookmarks = localStorage.getItem("bookmarkedFiles");
    if (storedBookmarks) {
      const parsedBookmarks = JSON.parse(storedBookmarks);
      setBookmarkedFiles(parsedBookmarks);
    }
  };

  useEffect(() => {
    loadBookmarks();

    window.addEventListener("bookmarksUpdated", loadBookmarks);
    return () => {
      window.removeEventListener("bookmarksUpdated", loadBookmarks);
    };
  }, []);

  useEffect(() => {
    if (show) {
      loadBookmarks();
    }
  }, [show]);

  const handleTabSelect = (tab: string | null, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tab) {
      setActiveTab(tab as "datasets" | "projects" | "other");
    }
  };

  const removeBookmark = (fileName: string) => {
    setBookmarkedFiles((prev) => {
      const updatedBookmarks = prev.filter(
        (bookmarkedFile) => bookmarkedFile.name !== fileName
      );
      localStorage.setItem("bookmarkedFiles", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });

    setTimeout(() => {
      window.dispatchEvent(new Event("bookmarksUpdated"));
    }, 50);
  };

  const handleItemClick = (fileData: FileData) => {
    setSelectedFileData(fileData);
    if (fileData.type?.toLowerCase() === "project") {
      setShowProjectInfoModal(true);
      setShowInfoModal(false);
    } else {
      setShowInfoModal(true);
      setShowProjectInfoModal(false);
    }
  };

  const cutText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const filteredBookmarks = bookmarkedFiles.filter((file) => {
    if (activeTab === "projects") {
      return file.type?.toLowerCase() === "project";
    } else {
      return file.type?.toLowerCase() !== "project";
    }
  });

  return (
    <div className="bookmark-dropdown-container">
      {bookmarkedFiles.length > 0 && (
        <div className="notification-badge">{bookmarkedFiles.length}</div>
      )}
      <DropdownButton
        id="dropdown-basic-button"
        title={<Bookmark size={20} />}
        align="end"
        show={show}
        onToggle={(isOpen) => setShow(isOpen)}
      >
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(tab) =>
            setActiveTab(tab as "datasets" | "projects" | "other")
          }
          onClick={(e) => e.stopPropagation()}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="other"
              onClick={(e) => handleTabSelect("other", e)}
              style={{ color: "black" }}
            >
              Datasets
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="projects"
              onClick={(e) => handleTabSelect("projects", e)}
              style={{ color: "black" }}
            >
              Projects
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((file: FileData) => (
            <Dropdown.Item
              key={file.name}
              className="d-flex align-items-center justify-content-between"
              style={{ cursor: "pointer", color: "#6796fb" }}
              onClick={() => handleItemClick(file)}
            >
              <div className="d-flex align-items-center">
                <Image
                  src={file.image}
                  alt={file.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                  rounded
                />
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    {cutText(file.name, 30)}
                  </div>
                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {file.category}
                  </div>
                </div>
              </div>
              <Trash
                className="text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(file.name);
                }}
                style={{
                  cursor: "pointer",
                  marginLeft: "20px",
                  padding: "8px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
              />
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled style={{ color: "#b0b4b8" }}>
            No bookmarks yet.
          </Dropdown.Item>
        )}
      </DropdownButton>
      <InfoModal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        fileData={selectedFileData}
      />
      <ProjectInfoModal
        show={showProjectInfoModal}
        onHide={() => setShowProjectInfoModal(false)}
        fileData={selectedFileData}
      />
    </div>
  );
};

export default BookmarkDropdown;
