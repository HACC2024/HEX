
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {Row , Col} from 'react-bootstrap';
import styles from '../styles/Categories.module.css';
import { House, MoonStarsFill, SunFill, PeopleFill, BusFrontFill, Book, Briefcase, Shield } from 'react-bootstrap-icons';
import { Database, ChevronDown } from "lucide-react";
import Link from 'next/link';
import DownloadCSVFiles from "./DataCards";
import BookmarkDropDown from "./Bookmark/BookmarksDropdown";

interface CategoriesContentProps {
  category: "community" | "transportation" | "school" | "employment" | "publicSafety";
}

const CategoriesContent = ({ category }: CategoriesContentProps) => {
  const categoryToCap = {
    community: "Community",
    transportation: "Transportation",
    school: "School",
    employment: "Employment",
    publicSafety: "Public Safety",
  };

  // Initialize with null or default value for SSR
  const [isLightMode, setIsLightMode] = useState<boolean | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | undefined>(undefined);

  const categoryData = useMemo(() => [
    { id: 1, icon: PeopleFill, title: "Community", catLink: "/Categories/community" },
    { id: 2, icon: BusFrontFill, title: "Transportation", catLink: "/Categories/transportation" },
    { id: 3, icon: Book, title: "School", catLink: "/Categories/school" },
    { id: 4, icon: Briefcase, title: "Employment", catLink: "/Categories/employment" },
    { id: 5, icon: Shield, title: "Public Safety", catLink: "/Categories/publicSafety" },
  ], []);

  // Load saved theme from localStorage on mount (client-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const isLight = savedTheme !== 'dark';
      setIsLightMode(isLight);

      const currentPath = window.location.pathname;
      const activeCategory = categoryData.find((category) => currentPath.includes(category.catLink));
      if (activeCategory) {
        setActiveSection(activeCategory.id);
      }
    }
  }, [categoryData]);

  const toggleLightMode = () => {
    const newTheme = isLightMode ? 'dark' : 'light';
    setIsLightMode(!isLightMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = (id: number) => {
    setActiveSection(id);
  };

  if (isLightMode === null) {
    // Prevent rendering until the theme is determined
    return <div>Loading...</div>;
  }

  const ContentsNavBar = () => (
    <nav
      className="navbar custom-navbar p-3 fixed-top"
      style={{
        width: "100vw",
        padding: "10px 0",
        backgroundColor: isLightMode ? "rgba(124, 174, 255, 0.743)" : "rgba(0, 0, 0, 0.743)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center" style={{ width: "100vw" }}>
        <div className="d-flex align-items-center position-relative">
          {/* Toggle Button */}
          <button
            className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ms-4 ${isLightMode ? "" : ""} ${styles.themeIcon}`}
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
            {/* Rounded Container for Icons */}
            <div
              className={`${isLightMode ? "bg-primary-subtle" : "bg-dark"} rounded-5 shadow-sm px-3 py-3 d-flex flex-column align-items-center ms-2 mt-3`}
            >
              {/* Home Icon */}
              <Link href="../" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Back to Home"
                >
                  <House size={18} />
                </button>
              </Link>
              {/* Database Icon */}
              <Link href="../Dashboard" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center mt-3 ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Dashboard"
                >
                  <Database size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Centered Navigation Icons (Only for larger screens) */}
        <div className="d-flex d-none d-md-flex align-items-center gap-3 " style={{ paddingLeft: '55px' }}>
          {categoryData.map(({ id, icon: Icon, title, catLink }) => (
            <Link href={catLink} passHref key={id}>
              <button
              
                onClick={() => handleLinkClick(id)} // Handle active state change
                className={`btn ${activeSection === id ? styles.navButtonActive : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center ${styles.navButton}`}
                
                style={{ width: "45px", height: "45px" }}
                title={title}
              >
                <Icon size={18} />
              </button>
            </Link>
          ))}
        </div>


        {/* Light/Dark Mode Toggle and Hamburger Menu */}
        <div className="d-flex align-items-center gap-2 d-md-none">
          <button
            onClick={toggleLightMode}
            className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
            title="Light/Dark Mode"
            style={{ width: "45px", height: "45px" }}
          >
            {isLightMode ? <MoonStarsFill size={18} /> : <SunFill size={18} />}
          </button>
          <button
            className={`btn btn-outline-primary rounded-circle me-5 ${styles.themeIcon}`}
            onClick={toggleMenu}
            style={{ width: "45px", height: "45px" }}
          >
            ☰
          </button>
          
        </div>




        {/* Light/Dark Mode Toggle (Visible on larger screens) */}

        <Row>
          <Col className="d-none d-md-block">
            <button
              onClick={toggleLightMode}
              className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center d-none d-md-inline me-5${styles.themeIcon}`}
              title="Light/Dark Mode"
              style={{
                width: "45px",
                height: "45px",
                padding: "0",
                lineHeight: "1",
              }}
            >
              {isLightMode ? <MoonStarsFill size={18} /> : <SunFill size={18} />}
            </button>
          </Col>
  
          <Col className="d-flex " style={{ paddingRight: '30px' }}>
           <BookmarkDropDown />
          </Col>
        </Row>
        
      </div>
      

      {/* Sidebar Menu for Small Screens */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            height: "100%",
            width: "250px",
            backgroundColor: isLightMode ? "rgba(255, 255, 255, 0.924)" : "rgba(0, 0, 0, 0.924)",
            zIndex: "1000",
            padding: "1rem",
          }}
        >
          <button
            className="btn btn-outline-primary"
            onClick={toggleMenu}
            style={{ position: "absolute", top: "1rem", right: "1rem" }}
          >
            ×
          </button>
          <div style={{ marginTop: "5rem" }}>
            <Link href="../Dashboard" passHref>
              <div className="nav-link" style={{ color: "rgba(54, 144, 255, 0.924)", marginBottom: "2rem", fontSize: "1rem" }}>
                Dashboard
              </div>
            </Link>
            {/* Additional links here */}
          </div>
        </div>
      )}
    </nav>
)

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
                <h1 className={`display-4 display-md-3 display-lg-2 ${styles.title} text-breaktext-break`}>
                  {categoryToCap[category]} Data
                </h1>
                <h4 className={`${styles.catsubtitle}`} >Data made Simple, Insights made Powerful, AI made Accessible</h4>
              </div>
              <div className={`${styles.rightLight} ${styles.rightLight1}`}></div>
              <div className="datacardsContainer py-5">
                <DownloadCSVFiles category={categoryToCap[category]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesContent;
