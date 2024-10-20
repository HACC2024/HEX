import React, { useState, useEffect } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../firebase"; // Import initialized Firebase

const DownloadCSVFiles: React.FC<{ category: string }> = ({ category }) => {
  const [files, setFiles] = useState<{ name: string; file: string }[]>([]);
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
        files.map((file) => (
          <button
            key={file.file}
            onClick={() => downloadFile(file.file, file.name)} // Use the file URL for downloading
          >
            Download {file.name}
          </button>
        ))
      )}
    </div>
  );
};

export default DownloadCSVFiles;
