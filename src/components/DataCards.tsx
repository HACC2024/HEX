"use client";

import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../.firebase/firebase";
import { Download } from "react-bootstrap-icons";
import SearchBar from "./SearchFilter";
import "../styles/DataCard.css";
import InfoModal from "./datacardModals/infoModal";
import DownloadModal from "./datacardModals/downloadModal";
import Bookmarks from "./Bookmark/Bookmarks";

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

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
              description: fileList[key].description,
              uploadedAt: fileList[key].uploadedAt,
              updatedAt: fileList[key].updatedAt,
              author: fileList[key].author,
              maintainer: fileList[key].maintainer,
              department: fileList[key].department,
              views: fileList[key].views || 0,
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

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedFiles");
    if (storedBookmarks) {
      setBookmarkedFiles(JSON.parse(storedBookmarks));
    }
  }, []);

  const extractFileNameFromURL = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    const fileName = fileNameWithParams?.split("?")[0];
    return fileName || "";
  };

  const isBookmarked = (fileName: string) => {
    return bookmarkedFiles.some(
      (bookmarkedFile) => bookmarkedFile.name === fileName
    );
  };

  const toggleBookmark = (file: FileData) => {
    if (isBookmarked(file.name)) {
      removeBookmark(file.name);
    } else {
      addBookmark(file);
    }

    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  const addBookmark = (file: FileData) => {
    if (isBookmarked(file.name)) return;

    setBookmarkedFiles((prev) => {
      const updatedBookmarks = [...prev, file];
      localStorage.setItem("bookmarkedFiles", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };
  const removeBookmark = (fileName: string) => {
    setBookmarkedFiles((prev) => {
      const updatedBookmarks = prev.filter(
        (bookmarkedFile) => bookmarkedFile.name !== fileName
      );
      localStorage.setItem("bookmarkedFiles", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
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
    setSelectedFile("");
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

  const searchedFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="search-bar-container">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {searchedFiles.map((file: FileData) => (
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
                <p className="file-category pt-1">{file.category}</p>
                <div className="file-tags pt-1">
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
                <div>
                  <p>Views: {file.views}</p>
                </div>
              </div>
              <div className="button-container d-flex align-items-center">
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
                <Bookmarks
                  file={file}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <InfoModal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        fileData={selectedFileData}
      />
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        fileOptions={currentFileOptions}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleDownload={handleDownload}
        extractFileNameFromURL={extractFileNameFromURL}
      />
    </div>
  );
};

export default DownloadCSVFiles;
