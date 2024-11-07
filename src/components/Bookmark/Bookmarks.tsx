import React, { useRef, useState } from "react";
import {
  BookmarkFill,
  Bookmark as BookmarkOutline,
} from "react-bootstrap-icons";

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

interface BookmarkManagerProps {
  file: FileData;
  isBookmarked: (fileName: string) => boolean;
  toggleBookmark: (file: FileData) => void;
}

const Bookmarks: React.FC<BookmarkManagerProps> = ({
  file,
  isBookmarked,
  toggleBookmark,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const isProcessing = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing.current) return;

    isProcessing.current = true;
    setButtonDisabled(true);

    toggleBookmark(file);

    setTimeout(() => {
      isProcessing.current = false;
      setButtonDisabled(false);
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      className="bookmark-icon-button"
      disabled={buttonDisabled}
      style={{ backgroundColor: isBookmarked(file.name) ? "white" : "inherit" }}
    >
      {isBookmarked(file.name) ? (
      <BookmarkFill />
      ) : (
      <BookmarkOutline />
      )}
    </button>
  );
};

export default Bookmarks;
