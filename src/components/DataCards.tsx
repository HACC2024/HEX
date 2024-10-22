import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../.firebase/firebase"; // Use the initialized database
import { Download } from "react-bootstrap-icons";
import "../styles/DataCard.css";

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<
    { name: string; file: string; category: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRefPath = dbRef(database, "Admin"); // Reference to the Admin path

    // Set up a listener for real-time updates
    const unsubscribe = onValue(
      dbRefPath,
      (snapshot) => {
        if (snapshot.exists()) {
          const fileList = snapshot.val();

          // Filter files by category
          const filteredFiles = Object.keys(fileList)
            .map((key) => ({
              name: fileList[key].name,
              file: fileList[key].file,
              image: fileList[key].image,
              category: fileList[key].category,
            }))
            .filter((file) => file.category === category);

          setFiles(filteredFiles);
        } else {
          console.log("No data available");
          setFiles([]);
        }
        setLoading(false); // Set loading to false after fetching
      },
      (error) => {
        console.error("Error fetching files:", error);
        setLoading(false); // Ensure loading is false on error
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [category]); // Fetch files again if the category changes

  const downloadFile = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName; // Use the provided file name
    document.body.appendChild(a);
    a.click();
    a.remove();

    alert(`Downloading ${fileName}`);
  };

  return (
    <div>
      <h1>Download CSV Files for {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.file} className="file-card">
              <Image
                src={file.image}
                alt="DataCard Image"
                className="card-image"
              />
              <div className="card-content">
                <h3>{file.name}</h3>
                <span>{file.category}</span>
                <p className="description">...</p>
                <button
                  onClick={() => downloadFile(file.file, file.name)}
                  className="download-button"
                >
                  Download <Download />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadCSVFiles;
