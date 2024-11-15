"use client";

import React, { useState, useEffect } from "react";
import { Image, Container, Col, Row } from "react-bootstrap";
import { ref as dbRef, onValue, update, get } from "firebase/database";
import { database } from "../../.firebase/firebase";
import { Download } from "react-bootstrap-icons";
import SearchBar from "./SearchFilter";
import "../styles/DataCard.css";
import ProjectInfoModal from "./projectcardComponents/infoModal";
import DownloadModal from "./projectcardComponents/downloadModal";
import Bookmarks from "./Bookmark/Bookmarks";
import SortOptions from "./projectcardComponents/sortFilter";

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

const ProjectCards: React.FC = () => {
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
  const [sortOption, setSortOption] = useState("mostPopular");

  useEffect(() => {
    const dbRefPath = dbRef(database, "Projects");

    const unsubscribe = onValue(
      dbRefPath,
      (snapshot) => {
        if (snapshot.exists()) {
          const fileList = snapshot.val();
          const filteredFiles: FileData[] = Object.keys(fileList).map(
            (key) => ({
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
              type: "project",
            })
          );

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
  });

  const sortFiles = (files: FileData[]) => {
    switch (sortOption) {
      case "mostRecent":
        return [...files].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "mostPopular":
        return [...files].sort((a, b) => b.views - a.views);
      case "nameAsc":
        return [...files].sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return [...files].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return files;
    }
  };

  const sortedFiles = sortFiles(
    files.filter(
      (file) =>
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.description.toLowerCase().includes(search.toLowerCase()) ||
        file.author.toLowerCase().includes(search.toLowerCase()) ||
        file.department.toLowerCase().includes(search.toLowerCase()) ||
        file.category.toLowerCase().includes(search.toLowerCase()) ||
        Object.values(file.file).some((arr) =>
          arr.some((str) => str.toLowerCase().includes(search.toLowerCase()))
        )
    )
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const incrementViews = async (fileData: FileData) => {
    try {
      const adminRef = dbRef(database, "Projects");
      const snapshot = await get(adminRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const fileKey = Object.keys(data).find(
          (key) => data[key].name === fileData.name
        );

        if (fileKey) {
          const fileRef = dbRef(database, `Projects/${fileKey}`);
          const currentViews = fileData.views || 0;

          await update(fileRef, {
            views: currentViews + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

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
    setBookmarkedFiles((prev) => {
      const isCurrentlyBookmarked = prev.some(
        (bookmarkedFile) => bookmarkedFile.name === file.name
      );

      let updatedBookmarks;
      if (isCurrentlyBookmarked) {
        updatedBookmarks = prev.filter(
          (bookmarkedFile) => bookmarkedFile.name !== file.name
        );
      } else {
        updatedBookmarks = [...prev, file];
      }

      localStorage.setItem("bookmarkedFiles", JSON.stringify(updatedBookmarks));

      setTimeout(() => {
        window.dispatchEvent(new Event("bookmarksUpdated"));
      }, 0);

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
    if (fileData) {
      setSelectedFileData(fileData);
      setShowInfoModal(true);
      incrementViews(fileData);
    }
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

  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <Container>
          <Row>
            <Col xs={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  width: "100%",
                  margin: 0,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1", minWidth: "250px" }}>
                  <SearchBar search={search} setSearch={setSearch} />
                </div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <SortOptions
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {sortedFiles.map((file: FileData) => (
            <div key={file.name} className="file-card-border">
              <div
                key={file.name}
                className="file-card bg-secondary-subtle"
                onClick={() => openInfoModal(file)}
              >
                <div className="cardbox">
                  <Image
                    src={file.image}
                    alt="DataCard Image"
                    className="card-image"
                  />
                </div>
                <div className="file-info">
                  <h3 className="file-name">{file.name}</h3>
                  <p className="file-category">{file.category}</p>
                  <div className="file-tags pt-1">
                    {Object.keys(file.file)
                      .filter(
                        (key) =>
                          file.file[key].length > 0 &&
                          file.file[key].some((url) => url !== "")
                      )
                      .slice(0, 4) // Display only the first 4 tags
                      .map((key) => (
                        <span
                          key={key}
                          className="file-tag"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {key}
                        </span>
                      ))}
                    {Object.keys(file.file).filter(
                      (key) =>
                        file.file[key].length > 0 &&
                        file.file[key].some((url) => url !== "")
                    ).length > 4 && (
                      <span className="file-tag">
                        +
                        {Object.keys(file.file).filter(
                          (key) =>
                            file.file[key].length > 0 &&
                            file.file[key].some((url) => url !== "")
                        ).length - 4}
                      </span>
                    )}
                  </div>
                  <div className="views-display">
                    <p>
                      Views:{" "}
                      {file.views >= 1000000
                        ? (file.views / 1000000).toFixed(1) + "M"
                        : file.views >= 1000
                        ? (file.views / 1000).toFixed(1) + "k"
                        : file.views}
                    </p>
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
            </div>
          ))}
        </div>
      )}
      <ProjectInfoModal
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

export default ProjectCards;
