"use client";

import React, { useState, useEffect } from "react";
import { ref as dbRef, onValue } from 'firebase/database';
import { database } from "../firebase"; // Use the initialized database

const DownloadCSVFiles: React.FC = () => {
    const [files, setFiles] = useState<{ name: string; file: string }[]>([]);
    const [loading, setLoading] = useState(true); // Start as loading

    useEffect(() => {
        const dbRefPath = dbRef(database, 'uploads'); // Reference to the uploads path

        // Set up a listener for real-time updates
        const unsubscribe = onValue(dbRefPath, (snapshot) => {
            if (snapshot.exists()) {
                const fileList = snapshot.val();
                
                const filesArray = Object.keys(fileList).map(key => ({
                    name: fileList[key].name,
                    file: fileList[key].file
                }));

                setFiles(filesArray);
            } else {
                console.log("No data available");
                setFiles([]); // Clear files if no data
            }
            setLoading(false); // Set loading to false after fetching
        }, (error) => {
            console.error("Error fetching files:", error);
            setLoading(false); // Ensure loading is false on error
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    const downloadFile = (fileUrl: string, fileName: string) => {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName; // Use the provided file name
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert(`Downloading ${fileName}`);
    };

    return (
        <div>
            <h1>Download CSV Files from Firebase Realtime Database</h1>
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
