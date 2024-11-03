"use client";

import React, { useState, useEffect } from "react";
import { Image, Dropdown, DropdownButton } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import InfoModal from "../datacardComponents/infoModal";
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
}

const BookmarkDropdown: React.FC = () => {
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileData[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(
    null
  );

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

    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  const openInfoModal = (fileData: FileData) => {
    setSelectedFileData(fileData);
    setShowInfoModal(true);
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

  return (
    <div className="bookmark-dropdown-container pb-3 px-5">
      <DropdownButton
        id="dropdown-basic-button"
        title="Bookmarked Files"
        align="end"
      >
        {bookmarkedFiles.length > 0 ? (
          bookmarkedFiles.map((file: FileData) => (
            <Dropdown.Item
              key={file.name}
              className="d-flex align-items-center"
              onClick={() => openInfoModal(file)}
            >
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
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold" }}>{file.name}</div>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  {file.category}
                </div>
              </div>
              <Trash
                className="text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(file.name);
                }}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No bookmarks yet.</Dropdown.Item>
        )}
      </DropdownButton>
      <InfoModal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        fileData={selectedFileData}
      />
    </div>
  );
};

export default BookmarkDropdown;
