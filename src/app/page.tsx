/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import "../styles/styles.css";
import "../styles/Lightmode.css";
import {
  PeopleFill,
  BusFrontFill,
  Book,
  Briefcase,
  Shield,
  CaretLeftFill,
  CaretRightFill,
} from "react-bootstrap-icons";
import Link from "next/link";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import HowItWorks from "../components/howItWorks";
import Introduction from "../components/introduction";
import { useEffect, useState } from "react";
import ChatBotsDesign from "@/components/ChatBotsDesign";

const HomeImage = () => {
  const words = ["RELIABLE", "RELEVANT", "READY"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="container-fluid HomeImageCt d-flex justify-content-center align-items-center pt-5">
      <div className="row w-100">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center fw-bold mt-5">
            UNLOCK HAWAII'S OPEN DATA
          </h1>

          {/* Flipping word animation */}
          <h2 className="text-center fw-bold mt-5">
            <span
              key={currentWordIndex}
              className="flip-word blue-text fw-bold"
            >
              {words[currentWordIndex]}
            </span>{" "}
             FOR YOUR DISCOVERY
          </h2>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src="/dark-graph.jpg"
            alt="3D Graph"
            className="img-fluid right-image rounded fade-in"
          />
        </div>
      </div>
      {/* Upward-facing lights */}
      <div id="Introduction" className="bottom-light left-light"></div>
      <div className="bottom-light right-light"></div>
    </div>
  );
};

const categoryData = [
  {
    name: "Community",
    icon: <PeopleFill className="fs-1" />,
    link: "/Categories/community",
  },
  {
    name: "Transportation",
    icon: <BusFrontFill className="fs-1" />,
    link: "/Categories/transportation",
  },
  {
    name: "School",
    icon: <Book className="fs-1" />,
    link: "/Categories/school",
  },
  {
    name: "Employment",
    icon: <Briefcase className="fs-1" />,
    link: "/Categories/employment",
  },
  {
    name: "Public Safety",
    icon: <Shield className="fs-1" />,
    link: "/Categories/publicSafety",
  },
];

const Categories: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const rotationStep = -360 / categoryData.length;

  // Calculate the centered index to determine which box is in front
  const centeredIndex =
    ((Math.round(rotation / rotationStep) % categoryData.length) +
      categoryData.length) %
    categoryData.length;

  // UseEffect to manage rotation animation and visibility change
  useEffect(() => {
    // Set up interval for rotation
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setRotation((prevRotation) => prevRotation + rotationStep);
      }, 2700); // Rotate every 2.7 seconds when not paused
    }

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true); // Pause when tab is not visible
      } else {
        setIsPaused(false); // Resume when tab is visible again
      }
    };

    // Attach visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused, rotationStep]);

  const handleMouseEnter = () => setIsPaused(true); // Pause rotation on hover
  const handleMouseLeave = () => setIsPaused(false); // Resume rotation on hover leave

  // Forward and Backward functions
  const handleForward = () => {
    setIsPaused(true); // Stop automatic rotation when button is clicked
    setRotation((prevRotation) => prevRotation + rotationStep);
  };

  const handleBackward = () => {
    setIsPaused(true); // Stop automatic rotation when button is clicked
    setRotation((prevRotation) => prevRotation - rotationStep);
  };

  return (
    <div
      id="Category"
      className="circular-categories-container text-center py-5 container-fluid"
    >
      <h1 className="custom-h1 mb-4">CHOOSE A CATEGORY</h1>
      <h4 className="custom-h4 mb-5">Which one would you like to explore?</h4>

      <div
        className="circular-display"
        style={{
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {categoryData.map((category, index) => (
          <Link
            key={index}
            href={category.link}
            className={`category-box ${
              index === centeredIndex ? "centered" : ""
            }`}
            onMouseEnter={
              index === centeredIndex ? handleMouseEnter : undefined
            }
            onMouseLeave={
              index === centeredIndex ? handleMouseLeave : undefined
            }
          >
            <div className="category-icon">{category.icon}</div>
            <strong>{category.name}</strong>
          </Link>
        ))}
      </div>
      {/* Spotlight effect */}
      <div className="spotlight-center"></div>
      <div className="spotlight-left"></div>
      <div className="spotlight-right"></div>

      {/* Forward and Backward Buttons */}
      <div
        className="button-container mt-4"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "nowrap",
        }}
      >
        <button
          onClick={handleBackward}
          className="btn btn-primary mx-2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CaretLeftFill />
        </button>
        <button
          onClick={handleForward}
          className="btn btn-primary mx-2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CaretRightFill />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  useEffect(() => {
    if (sessionStorage.getItem("refreshHome")) {
      sessionStorage.removeItem("refreshHome");
      window.location.href = "/"; // Hard reload the homepage to ensure a full refresh
    }
  }, []);
  return (
    <main>
      <Navbar />
      <HomeImage />
      <Introduction />
      <Categories />
      <HowItWorks />
      <ChatBotsDesign />
      <Footer />
    </main>
  );
}
