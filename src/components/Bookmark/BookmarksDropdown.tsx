"use client";

import React, { useState, useEffect } from "react";
import { Image, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { Trash, Bookmark } from "react-bootstrap-icons";
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
  const [showAll, setShowAll] = useState(false);

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

  const cutText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const displayedBookmarks = showAll
    ? bookmarkedFiles
    : bookmarkedFiles.slice(0, 8);

  return (
    <div className="bookmark-dropdown-container">
      {bookmarkedFiles.length > 0 && (
        <div className="notification-badge">
          {bookmarkedFiles.length}
        </div>
      )}
      <DropdownButton
        id="dropdown-basic-button"
        title={<Bookmark size={20} />}
        align="end"
      >
        {bookmarkedFiles.length > 0 ? (
          <>
            {displayedBookmarks.map((file: FileData) => (
              <Dropdown.Item
                key={file.name}
                className="d-flex align-items-center justify-content-between"
                onClick={() => openInfoModal(file)}
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
                  }}
                />
              </Dropdown.Item>
            ))}
            {bookmarkedFiles.length > 8 && (
              <Dropdown.Item as="div" className="text-center">
                <Button
                  variant="link"
                  onClick={() => setShowAll(!showAll)}
                  className="show-more-button"
                >
                  {showAll ? "Show Less" : "Show More"}
                </Button>
              </Dropdown.Item>
            )}
          </>
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
