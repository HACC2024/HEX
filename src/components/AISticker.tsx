import { useState, useEffect } from "react";
import UncleChatbot from "./UncleChatbot";
import "../styles.css";
import { MessageSquare } from "lucide-react";

const calculatePosition = () => {
  return { x: 0, y: 0 };
};

const AISticker = () => {
  const [position, setPosition] = useState(calculatePosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - 170,
        y: window.innerHeight - 200,
      });
    };

    if (typeof window !== "undefined") {
      updatePosition();
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updatePosition);
      }
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setWasDragged(false);
    setOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const newX = event.clientX - offset.x;
      const newY = event.clientY - offset.y;
      setPosition({ x: newX, y: newY });
      setWasDragged(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleOpenModal = () => {
    if (!wasDragged) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className="floating-icon"
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 10,
          opacity: 1,
          transition: "opacity 0.3s ease-in",
          cursor: "pointer",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleOpenModal}
        onClick={(event) => event.preventDefault()}
      >
        <div className="icon-container">
          <MessageSquare size={32} color="white" />
          <span className="chat-text text-white">Uncle HEX!</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UncleChatbot />
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AISticker;
