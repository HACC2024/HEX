"use client";

import React, { useState, useEffect } from "react";
import { Image, Dropdown, DropdownButton } from "react-bootstrap";
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
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(null);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedFiles");
    if (storedBookmarks) {
      setBookmarkedFiles(JSON.parse(storedBookmarks));
    }
  }, []);

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
    }, 100);
  };

  const handleItemClick = (fileData: FileData) => {
    setSelectedFileData(fileData);
    console.log('File Data:', fileData); // Debug the entire fileData object
    console.log('Type:', fileData.type); // Debug the type specifically
    console.log('Type comparison:', fileData.type === 'project'); // Debug the comparison
  
    // Use strict equality and ensure type is case-sensitive
    if (fileData.type && fileData.type.toLowerCase() === 'project') {
      console.log('Opening Project Modal');
      setShowProjectInfoModal(true);
      setShowInfoModal(false); // Ensure other modal is closed
    } else {
      console.log('Opening Info Modal');
      setShowInfoModal(true);
      setShowProjectInfoModal(false); // Ensure other modal is closed
    }
  };

  useEffect(() => {
    const handleBookmarksUpdate = () => {
      const storedBookmarks = localStorage.getItem("bookmarkedFiles");
      if (storedBookmarks) {
        setBookmarkedFiles(JSON.parse(storedBookmarks));
      }
    };
    window.addEventListener("bookmarksUpdated", handleBookmarksUpdate);
    handleBookmarksUpdate();
    return () => {
      window.removeEventListener("bookmarksUpdated", handleBookmarksUpdate);
    };
  }, []);

  const cutText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="bookmark-dropdown-container">
      {bookmarkedFiles.length > 0 && (
        <div className="notification-badge">{bookmarkedFiles.length}</div>
      )}
      <DropdownButton
        id="dropdown-basic-button"
        title={<Bookmark size={20} />}
        align="end"
      >
        {bookmarkedFiles.length > 0 ? (
          bookmarkedFiles.map((file: FileData) => (
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
          <Dropdown.Item disabled style={{color: "#b0b4b8"}}>No bookmarks yet.</Dropdown.Item>
        )}
      </DropdownButton>
      {/* Regular InfoModal for non-project items */}
      <InfoModal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        fileData={selectedFileData}
      />
      {/* ProjectInfoModal for project items */}
      <ProjectInfoModal
        show={showProjectInfoModal}
        onHide={() => setShowProjectInfoModal(false)}
        fileData={selectedFileData}
      />
    </div>
  );
};

export default BookmarkDropdown;