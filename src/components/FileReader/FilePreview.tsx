"use client";

import React, { useEffect, useState } from "react";
import DocPreview from "./DocPreview";

interface FilePreviewProps {
  file: { [key: string]: string[] } | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const extractFileName = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    const fileName = fileNameWithParams?.split("?")[0];
    return fileName || "";
  };

  const isDocumentType = (str: string): boolean => {
    const docTypes = [".pdf", ".doc", ".docx", ".DOC", ".DOCX", ".PDF"];
    return docTypes.some((ext) =>
      str.toLowerCase().includes(ext.toLowerCase())
    );
  };

  useEffect(() => {
    console.log("File object structure:", file);

    if (file) {
      console.log("Available keys:", Object.keys(file));

      const firstFileUrl = Object.entries(file)
        .flatMap(([key, urls]) =>
          urls.filter((url) => isDocumentType(url) || isDocumentType(key))
        )
        .find((url) => !!url);

      if (firstFileUrl) {
        setSelectedFileUrl(firstFileUrl);
        setFileName(extractFileName(firstFileUrl));
      }
    }
  }, [file]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = event.target.value;
    setSelectedFileUrl(selectedUrl);
    setFileName(extractFileName(selectedUrl));
  };

  return (
    <div className="file-preview-container">
      <h5>Preview Your File</h5>

      <div className="dropdown">
        <select
          className="form-control"
          value={selectedFileUrl}
          onChange={handleFileSelect}
        >
          <option value="">Select a file</option>
          {file &&
            Object.entries(file).flatMap(([key, urls]) =>
              urls
                .filter((url) => isDocumentType(url) || isDocumentType(key))
                .map((url, index) => (
                  <option key={`${key}-${index}`} value={url}>
                    {`${key} - ${extractFileName(url)}`}
                  </option>
                ))
            )}
        </select>
      </div>

      {selectedFileUrl && (
        <div className="file-preview">
          <h6>Preview: {fileName}</h6>
          {selectedFileUrl.toLowerCase().includes(".pdf") ? (
            <iframe
              src={selectedFileUrl}
              width="100%"
              height="500px"
              title="PDF Preview"
            ></iframe>
          ) : (
            <DocPreview content={selectedFileUrl} className="mt-3" />
          )}
        </div>
      )}
    </div>
  );
};

export default FilePreview;
