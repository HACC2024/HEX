"use client";

import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import styles from "../styles/Categories.module.css";

import { House, MoonStarsFill, SunFill } from "react-bootstrap-icons";
import { BarChart4, ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import ProjectCards from "./ProjectCards";
import BookmarkDropDown from "./Bookmark/BookmarksDropdown";
import UserUploadSticker from "./UserUploadSticker";

const ProjectContent = () => {
  useEffect(() => {
    if (sessionStorage.getItem("shouldRefresh")) {
      sessionStorage.removeItem("shouldRefresh");
      window.location.reload();
    }
  }, []);

  const [isLightMode, setIsLightMode] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load saved theme from localStorage on mount (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const isLight = savedTheme !== "dark";
      setIsLightMode(isLight);
    }
  }, []);

  const toggleLightMode = () => {
    const newTheme = isLightMode ? "dark" : "light";
    setIsLightMode(!isLightMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  if (isLightMode === null) {
    return <div>Loading...</div>;
  }

  const ContentsNavBar = () => (
    <nav
      className="navbar custom-navbar p-3 fixed-top"
      style={{
        width: "100vw",
        padding: "10px 0",
        backgroundColor: isLightMode
          ? "rgba(124, 174, 255, 0.743)"
          : "rgba(0, 0, 0, 0.743)",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ width: "100vw" }}
      >
        <div className="d-flex align-items-center position-relative">
          {/* Toggle Button */}
          <button
            className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ms-4 ${
              isLightMode ? "" : ""
            } ${styles.themeIcon}`}
            style={{ width: "45px", height: "45px" }}
            onClick={() => setIsOpen(!isOpen)}
            title="Show Navigation"
          >
            <ChevronDown
              size={18}
              style={{
                transform: isOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
          {/* Icons Container */}
          <div
            className="position-absolute"
            style={{
              left: "0",
              top: "60px",
              transform: isOpen ? "translateY(0)" : "translateY(-20px)",
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
              transition: "all 0.3s ease",
            }}
          >
            <div
              className={`${
                isLightMode ? "bg-primary-subtle" : "bg-dark"
              } rounded-5 shadow-sm px-3 py-3 d-flex flex-column align-items-center ms-2 mt-3`}
            >
              <button
                className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
                style={{ width: "45px", height: "45px" }}
                title="Back to Home"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                <House size={18} />
              </button>
              <Link href="../Dashboard" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center mt-3 ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Dashboard"
                >
                  <BarChart4 size={18} />
                </button>
              </Link>
              <Link href="/Categories/community" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center mt-3 ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Explore Data Categories"
                >
                  <LayoutGrid size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Centered Text (Only for larger screens) */}
        <div
          className="d-flex d-none d-md-flex align-items-center gap-3"
          style={{ paddingLeft: "55px" }}
        >
          <h4 className="m-0 text-white">Community Showcase</h4>
        </div>

        {/* Mobile Layout - Light/Dark Mode Toggle and Hamburger Menu */}
        <div className="d-flex align-items-center justify-content-between w-100 d-md-none">
          {/* Left spacer */}
          <div style={{ width: "45px" }}></div>

          {/* Centered Text for mobile */}
          <BookmarkDropDown />

          {/* Right controls */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={toggleLightMode}
              className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
              title="Light/Dark Mode"
              style={{ width: "45px", height: "45px" }}
            >
              {isLightMode ? (
                <MoonStarsFill size={18} />
              ) : (
                <SunFill size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout - Light/Dark Mode Toggle and Bookmark */}
        <Row className="d-none d-md-flex">
          <Col style={{ paddingRight: "0" }}>
            <button
              onClick={toggleLightMode}
              className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
              title="Light/Dark Mode"
              style={{
                width: "45px",
                height: "45px",
                padding: "0",
                lineHeight: "1",
              }}
            >
              {isLightMode ? (
                <MoonStarsFill size={18} />
              ) : (
                <SunFill size={18} />
              )}
            </button>
          </Col>

          <Col className="d-flex me-4" style={{ paddingRight: "30px" }}>
            <BookmarkDropDown />
          </Col>
        </Row>
      </div>
    </nav>
  );

  return (
    <div
      id="categoriesPageMain"
      className={`mainContainer ${isLightMode ? "light-mode" : ""}`}
      style={{
        backgroundColor: isLightMode ? "#ffffff" : "#000000",
        color: isLightMode ? "#000000" : "#ffffff",
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
      }}
    >
      <ContentsNavBar />
      <div className={`${styles.leftLight} ${styles.leftLight1}`}></div>

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="content-container">
              <div className={`text-center mb-4 ${styles.titleWrapper}`}>
                <h1
                  className={`display-4 display-md-3 display-lg-2 ${styles.title} text-break`}
                >
                  Community Projects
                </h1>
                <h5 className={`${styles.catsubtitle}`}>
                  Discover Past Projects To Gain Inspiration And Connect With
                  The Community
                </h5>
              </div>
              <div
                className={`${styles.rightLight} ${styles.rightLight1}`}
              ></div>
              <div className="datacardsContainer py-5">
                <ProjectCards />
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserUploadSticker />
    </div>
  );
};

export default ProjectContent;
