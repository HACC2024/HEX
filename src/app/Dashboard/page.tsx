/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/csvReader.module.css";
import UncleChatbot from "../../components/UncleChatbot";
import SecurityReport from "../security-report/page";
import AdminPortal from "../Admin/_components/AdminPortal";
import BookmarkDropDown from "@/components/Bookmark/BookmarksDropdown";
import {
  BarChart,
  MessageCircle,
  WrenchIcon,
  ShieldAlert,
  Settings,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { House, MoonStarsFill, SunFill, Pencil } from "react-bootstrap-icons";
import { Row, Col } from "react-bootstrap";
import NotepadEditor from "./Notebook/NotepadEditor";

const CsvReader = dynamic(() => import("../../components/csvTool/CsvReader"), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "300px" }}
    >
      <div className="text-center">
        <div className={`${styles.spinner} mb-3 mx-auto`}></div>
        <p className={styles.loadingText}>Loading CSV Visualizer...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showSecurityReport, setShowSecurityReport] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
      setIsLightMode(true);
    }
  }, []);

  const toggleLightMode = () => {
    const newMode = !isLightMode;
    document.body.classList.toggle("light-mode", newMode);
    setIsLightMode(newMode);
    // Save theme preference to localStorage
    localStorage.setItem("theme", newMode ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Track active section AND handle responsive menu
  useEffect(() => {
    // Debounce function
    interface DebouncedFunction {
      (...args: any[]): void;
    }

    const debounce = (
      func: (...args: any[]) => void,
      wait: number
    ): DebouncedFunction => {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: any[]): void {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const handleScroll = () => {
      const sections = [1, 2, 3, 4, 5].map((num) => ({
        element: document.getElementById(`section-${num}`),
        id: num,
      }));

      let maxVisibility = 0;
      let mostVisibleSection = activeSection;

      sections.forEach(({ element, id }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const visibleHeight =
            Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const sectionVisibility =
            Math.max(0, visibleHeight) /
            Math.min(element.offsetHeight, windowHeight);

          if (sectionVisibility > maxVisibility) {
            maxVisibility = sectionVisibility;
            mostVisibleSection = id;
          }
        }
      });

      if (mostVisibleSection > 0 && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection);
      }
    };

    // Handle both resize and menu state
    const handleResize = () => {
      // Close menus if screen is large
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMenuOpen(false); // Close sidebar
        setIsOpen(false); // Close dropdown
      }
      handleScroll(); // Also check section visibility
    };

    // Debounced versions
    const debouncedScroll = debounce(handleScroll, 100);
    const debouncedResize = debounce(handleResize, 100);

    // Add event listeners
    window.addEventListener("scroll", debouncedScroll);
    window.addEventListener("resize", debouncedResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [activeSection]); // Add any other dependencies if needed

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibleSections((prev) => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(entry.target.id);
            }
            return newSet;
          });
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // Observe all sections
    document.querySelectorAll(".tool-section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Navigation Bar Component
  const NavBar = () => (
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
            {/* Rounded Container for Icons */}
            <div
              className={`${
                isLightMode ? "bg-primary-subtle" : "bg-dark"
              } rounded-5 shadow-sm px-3 py-3 d-flex flex-column align-items-center ms-2 mt-3`}
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

              {/* Layout Grid Icon */}
              <Link href="/Categories/community" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center mt-3 ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Explore Data Categories"
                >
                  <LayoutGrid size={18} />
                </button>
              </Link>
              <Link href="../Projects/community" passHref>
                <button
                  className={`btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center mt-3 ${styles.themeIcon}`}
                  style={{ width: "45px", height: "45px" }}
                  title="Go to Projects"
                >
                  <Pencil size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Centered Navigation Icons (Only for larger screens) */}
        <div
          className="d-none d-md-flex align-items-center gap-3"
          style={{ paddingLeft: "55px" }}
        >
          {[
            { id: 1, icon: BarChart, title: "Data Visualizer" },
            { id: 2, icon: MessageCircle, title: "AI Assistant" },
            { id: 3, icon: WrenchIcon, title: "Admin Assistant" },
            { id: 4, icon: ShieldAlert, title: "Security Report" },
            { id: 5, icon: Settings, title: "Admin Dashboard" },
          ].map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() =>
                document
                  .getElementById(`section-${id}`)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`btn ${
                activeSection === id
                  ? styles.navButtonActive
                  : "btn-outline-primary"
              } rounded-circle d-flex align-items-center justify-content-center ${
                styles.navButton
              }`}
              style={{ width: "45px", height: "45px" }}
              title={title}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        {/* Mobile Layout - Light/Dark Mode Toggle and Hamburger Menu */}
        <div className="d-flex align-items-center justify-content-between w-100 d-md-none">
          {/* Left spacer */}
          <div style={{ width: "45px" }}></div>

          {/* Centered Bookmark */}
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
            <button
              className={`btn btn-outline-primary rounded-circle me-5 ${styles.themeIcon}`}
              onClick={toggleMenu}
              style={{ width: "45px", height: "45px" }}
            >
              ☰
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

      {/* Sidebar Menu for Small Screens */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            height: "100%",
            width: "250px",
            backgroundColor: isLightMode
              ? "rgba(255, 255, 255, 0.924)"
              : "rgba(0, 0, 0, 0.924)",
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
            <Link href="#section-1" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                Data Visualizer
              </div>
            </Link>
            <Link href="#section-2" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                AI Assistant
              </div>
            </Link>
            <Link href="#section-3" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                Notebook Workspace
              </div>
            </Link>
            <Link href="#section-4" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                Security Report
              </div>
            </Link>
            <Link href="#section-5" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                Admin Dashboard
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <main
      className={`mainContainer ${isLightMode ? "light-mode" : ""}`}
      style={{
        backgroundColor: isLightMode ? "#ffffff" : "#000000",
        color: isLightMode ? "#000000" : "#ffffff",
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
      }}
    >
      <NavBar />
      <div className={`${styles.leftLight} ${styles.leftLight1}`}></div>
      <div className={`${styles.rightLight} ${styles.rightLight1}`}></div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className={`text-center mb-4 ${styles.titleWrapper}`}>
              <h1
                className={`display-4 display-md-3 display-lg-2 ${styles.title} text-breaktext-break`}
              >
                HEX Open Data Dashboard
              </h1>
            </div>

            {/* Tool 1: Data Visualizer */}
            <div
              id="section-1"
              className={`tool-section mb-5 ${styles.section}`}
              style={{
                opacity: visibleSections.has("section-1") ? 1 : 0,
                transform: visibleSections.has("section-1")
                  ? "none"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>1</div>
                <div className={styles.toolIcon}>
                  <BarChart size={24} />
                </div>
                <div className={styles.toolLabel}>Data Visualizer</div>
              </div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Upload your CSV file to create interactive visualizations and
                analyze your data.
              </p>
              <div
                className={`card mt-5 mb-5 ${styles.customCard}`}
                style={{ paddingTop: "1rem" }}
              >
                <div className="card-body text-center py-4">
                  <CsvReader />
                </div>
              </div>
            </div>

            <div className={`${styles.rightLight} ${styles.rightLight2}`}></div>
            <div className={`${styles.leftLight} ${styles.leftLight2}`}></div>

            {/* Tool 2: Uncle HEX Chatbot */}
            <div
              id="section-2"
              className={`tool-section mt-5 ${styles.section}`}
              style={{
                opacity: visibleSections.has("section-2") ? 1 : 0,
                transform: visibleSections.has("section-2")
                  ? "none"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>2</div>
                <div className={styles.toolIcon}>
                  <MessageCircle size={24} />
                </div>
                <div className={styles.toolLabel}>AI Assistant</div>
              </div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Need help understanding your data? We are here to assist with
                your data analysis journey!
              </p>

              <div className={`card mt-5 mb-5 ${styles.customCard}`}>
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>👋</span> Meet Uncle HEX
                  </h2>
                  <h3 className={styles.uncleSubtitle}>
                    Your Local Data Scientist
                  </h3>

                  <div className={styles.uncleDescription}>
                    <p>I can read CSV, JSON, XML, and RDF Files!</p>
                  </div>

                  <button
                    className={`btn ${
                      showChatbot ? "btn-outline-danger" : "btn-outline-primary"
                    } 
                    btn-lg mt-3`}
                    onClick={() => setShowChatbot(!showChatbot)}
                  >
                    {showChatbot ? "× Close Chat" : "💬 Chat with Uncle HEX"}
                  </button>
                </div>
              </div>

              {showChatbot && (
                <div className={`card mt-4 ${styles.chatbotContainer}`}>
                  <div className="card-body p-4">
                    <UncleChatbot />
                  </div>
                </div>
              )}
            </div>

            {/* Add visual separator with more spacing */}
            <hr className="my-5 opacity-0" style={{ margin: "4rem 0" }} />

            {/* Tool 3: Admin Assistant */}
            <div
              id="section-3"
              className={`tool-section mt-5 ${styles.section}`}
              style={{
                opacity: visibleSections.has("section-3") ? 1 : 0,
                transform: visibleSections.has("section-3")
                  ? "none"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                position: "relative",
                zIndex: 10,
              }}
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>3</div>
                <div className={styles.toolIcon}>
                  <WrenchIcon size={24} />
                </div>
                <div className={styles.toolLabel}>Interactive Workspace</div>
              </div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Create custom reports, explore insights, and drive your research
                forward—all in one place.
              </p>

              <div className={`card mt-5 mb-5 ${styles.customCard}`}>
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>🔧</span> HEX InstaNote
                  </h2>
                  <h3 className={styles.uncleSubtitle}>Your All-in-One Report Notebook</h3>

                  <div className={styles.uncleDescription}>
                    <p>
                    Create, edit, and generate reports effortlessly, all in one place!
                    </p>
                  </div>

                  <button
                    className={`btn ${
                      showNotebook
                        ? "btn-outline-danger"
                        : "btn-outline-primary"
                    } btn-lg mt-3`}
                    onClick={() => setShowNotebook(!showNotebook)}
                  >
                    {showNotebook ? "× Close Notebook" : "✏️ Build A Report"}
                  </button>
                </div>
              </div>

              {showNotebook && (
                <div className={`card mt-4 ${styles.chatbotContainer}`}>
                  <div className="card-body p-4">
                    <NotepadEditor />
                  </div>
                </div>
              )}
            </div>

            {/* Add visual separator with more spacing */}
            <hr className="my-5 opacity-0" style={{ margin: "4rem 0" }} />

            {/* Tool 4: Security Report */}
            <div
              id="section-4"
              className={`tool-section mt-5 ${styles.section}`}
              style={{
                opacity: visibleSections.has("section-4") ? 1 : 0,
                transform: visibleSections.has("section-4")
                  ? "none"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>4</div>
                <div className={styles.toolIcon}>
                  <ShieldAlert size={24} />
                </div>
                <div className={styles.toolLabel}>Security Report</div>
              </div>
              <div
                className={`${styles.rightLight} ${styles.rightLight3}`}
              ></div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Found a security concern? Help us maintain the integrity of our
                platform.
              </p>

              <div className={`card mt-5 mb-5 ${styles.customCard}`}>
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>🛡️</span> Security
                    Center
                  </h2>
                  <h3 className={styles.uncleSubtitle}>
                    Report Security Issues
                  </h3>

                  <div className={styles.uncleDescription}>
                    <p>
                      Help us keep HEX secure by reporting potential
                      vulnerabilities.
                    </p>
                  </div>

                  <button
                    className={`btn ${
                      showSecurityReport
                        ? "btn-outline-danger"
                        : "btn-outline-primary"
                    } btn-lg mt-3`}
                    onClick={() => setShowSecurityReport(!showSecurityReport)}
                  >
                    {showSecurityReport
                      ? "× Close Form"
                      : "🔒 Submit Security Report"}
                  </button>
                </div>
              </div>

              {showSecurityReport && (
                <div className={`card mt-4 ${styles.chatbotContainer}`}>
                  <div className="card-body p-4">
                    <SecurityReport />
                  </div>
                </div>
              )}
            </div>

            {/* Add visual separator with more spacing */}
            <hr className="my-5 opacity-0" style={{ margin: "4rem 0" }} />

            {/* Tool 5: Admin Portal */}
            <div
              id="section-5"
              className={`tool-section mt-5 ${styles.section}`}
              style={{
                opacity: visibleSections.has("section-5") ? 1 : 0,
                transform: visibleSections.has("section-5")
                  ? "none"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>5</div>
                <div className={styles.toolIcon}>
                  <Settings size={24} />
                </div>
                <div className={styles.toolLabel}>Admin Dashboard</div>
              </div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Access administrative tools and manage HEX platform settings.
              </p>

              <div className={`card mt-5 mb-5 ${styles.customCard}`}>
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>⚙️</span> Admin Control
                    Center
                  </h2>
                  <h3 className={styles.uncleSubtitle}>Platform Management</h3>

                  <div className={styles.uncleDescription}>
                    <p>
                      Configure settings, manage data, and monitor platform
                      activity.
                    </p>
                  </div>

                  <button
                    className={`btn ${
                      showAdminPortal
                        ? "btn-outline-danger"
                        : "btn-outline-primary"
                    } btn-lg mt-3`}
                    onClick={() => setShowAdminPortal(!showAdminPortal)}
                  >
                    {showAdminPortal
                      ? "× Close Admin Panel"
                      : "⚡ Open Admin Portal"}
                  </button>
                </div>
              </div>

              {showAdminPortal && (
                <div className={`card mt-4 ${styles.chatbotContainer}`}>
                  <div className="card-body p-4">
                    <AdminPortal />
                  </div>
                </div>
              )}
            </div>

            {/* Add final spacing at the bottom */}
            <div style={{ marginBottom: "5rem" }}></div>
          </div>
        </div>
      </div>
    </main>
  );
}
