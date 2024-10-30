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
import React, { useEffect, useState } from "react";
import ChatBotsDesign from "@/components/ChatBotsDesign";

const HomeImage: React.FC<{ isLightMode: boolean }> = ({ isLightMode }) => {
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
        <h1 className="text-center fw-bold mt-5 mb-4">
            <span className="flip-word blue-text fw-bold">
              UHSPACE DATA HUB
            </span>{" "}
          </h1> 
          <h5 className="text-center mt-2">
          Unlocking Hawaii's Solutions for Personalized Analytics and Collaborative Engagement
          </h5>
          <h3 className="text-center fw-bold mt-4">
            <span className="flip-word blue-text fw-bold">
              {words[currentWordIndex]}
            </span>{" "}
            FOR YOUR DISCOVERY
          </h3>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={isLightMode ? "/HEX-HACC-2024-LIGHT-6.png" : "/dark-graph.jpg"}
            alt="3D Graph"
            className="img-fluid right-image rounded fade-in"
          />
        </div>
      </div>
      <div id="Introduction" className="bottom-light left-light"></div>
      <div className="bottom-light right-light"></div>
    </div>
  );
};

const categoryData = [
  {
    id: "community", // Use a unique ID instead of index
    name: "Community",
    icon: <PeopleFill className="fs-1" />,
    link: "/Categories/community",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: <BusFrontFill className="fs-1" />,
    link: "/Categories/transportation",
  },
  {
    id: "school",
    name: "School",
    icon: <Book className="fs-1" />,
    link: "/Categories/school",
  },
  {
    id: "employment",
    name: "Employment",
    icon: <Briefcase className="fs-1" />,
    link: "/Categories/employment",
  },
  {
    id: "publicSafety",
    name: "Public Safety",
    icon: <Shield className="fs-1" />,
    link: "/Categories/publicSafety",
  },
];

const Categories: React.FC<{ isLightMode: boolean }> = React.memo(() => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const rotationStep = -360 / categoryData.length;

  const centeredIndex =
    ((Math.round(rotation / rotationStep) % categoryData.length) +
      categoryData.length) %
    categoryData.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setRotation((prevRotation) => prevRotation + rotationStep);
      }, 2700);
    }

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused, rotationStep]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleForward = () => {
    setIsPaused(true);
    setRotation((prevRotation) => prevRotation + rotationStep);
  };

  const handleBackward = () => {
    setIsPaused(true);
    setRotation((prevRotation) => prevRotation - rotationStep);
  };

  return (
    <div id="Category" className="circular-categories-container text-center py-5 container-fluid">
      <h1 className="custom-h1 mb-4">CHOOSE A CATEGORY</h1>
      <h4 className="custom-h4 mb-5">Explore Hundreds of Open Source Data!</h4>

      <div className="circular-display" style={{ transform: `rotateY(${rotation}deg)` }}>
        {categoryData.map((category, index) => (
          <Link
            key={category.id} // Use the unique ID
            href={category.link}
            className={`category-box ${index === centeredIndex ? "centered" : ""}`}
            onMouseEnter={index === centeredIndex ? handleMouseEnter : undefined}
            onMouseLeave={index === centeredIndex ? handleMouseLeave : undefined}
          >
            <div className="category-icon">{category.icon}</div>
            <strong>{category.name}</strong>
          </Link>
        ))}
      </div>
      <div className="spotlight-center"></div>
      <div className="spotlight-left"></div>
      <div className="spotlight-right"></div>

      <div className="button-container mt-4" style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={handleBackward} className="btn btn-primary mx-2">
          <CaretLeftFill />
        </button>
        <button onClick={handleForward} className="btn btn-primary mx-2">
          <CaretRightFill />
        </button>
      </div>
    </div>
  );
});

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("refreshHome")) {
      sessionStorage.removeItem("refreshHome");
      window.location.href = "/"; // Hard reload the homepage to ensure a full refresh
    }
  }, []);

  return (
    <main>
      <Navbar isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <HomeImage isLightMode={isLightMode} />
      <Introduction />
      <Categories isLightMode={isLightMode} />
      <HowItWorks />
      <ChatBotsDesign />
      <Footer />
    </main>
  );
}
