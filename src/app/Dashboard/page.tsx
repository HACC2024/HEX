"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/csvReader.module.css";
import UncleChatbot from "../../components/UncleChatbot";
import Chatbot from "../../components/Chatbot";
import SecurityReport from "../security-report/page";
import AdminPortal from "../Admin/_components/AdminPortal";
import {
  BarChart,
  MessageCircle,
  WrenchIcon,
  ShieldAlert,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { House, MoonStarsFill, SunFill } from "react-bootstrap-icons";

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
  const [showAdminChatbot, setShowAdminChatbot] = useState(false);
  const [showSecurityReport, setShowSecurityReport] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [1, 2, 3, 4, 5].map((num) =>
        document.getElementById(`section-${num}`)?.getBoundingClientRect()
      );

      const currentSection =
        sections.findIndex(
          (rect) =>
            rect &&
            rect.top <= window.innerHeight * 0.5 &&
            rect.bottom >= window.innerHeight * 0.5
        ) + 1;

      if (currentSection > 0 && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    const handleResize = () => handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeSection]);

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
        {/* Home Icon */}
        <Link href="../" passHref>
          <button
            className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
            title="Back to Home"
          >
            <House size={18} />
          </button>
        </Link>

        {/* Centered Navigation Icons (Only for larger screens) */}
        <div className="d-none d-md-flex align-items-center gap-3">
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

        {/* Light/Dark Mode Toggle and Hamburger Menu */}
        <div className="d-flex align-items-center gap-2 d-md-none">
          <button
            onClick={toggleLightMode}
            className={`btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center ${styles.themeIcon}`}
            title="Light/Dark Mode"
            style={{ width: "45px", height: "45px" }}
          >
            {isLightMode ? <MoonStarsFill size={18} /> : <SunFill size={18} />}
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={toggleMenu}
            style={{ width: "45px", height: "45px" }}
          >
            ☰
          </button>
        </div>

        {/* Light/Dark Mode Toggle (Visible on larger screens) */}
        <button
          onClick={toggleLightMode}
          className={`btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center d-none d-md-inline ${styles.themeIcon}`}
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
                  marginBottom: "1rem",
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
                  marginBottom: "1rem",
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
                  marginBottom: "1rem",
                }}
              >
                Admin Assistant
              </div>
            </Link>
            <Link href="#section-4" passHref>
              <div
                className="nav-link"
                style={{
                  color: "rgba(54, 144, 255, 0.924)",
                  marginBottom: "1rem",
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
                  marginBottom: "1rem",
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
                    } ${styles.chatButton}
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
            >
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>3</div>
                <div className={styles.toolIcon}>
                  <WrenchIcon size={24} />
                </div>
                <div className={styles.toolLabel}>Admin Portal Assistant</div>
              </div>

              <p
                className={styles.subtitle}
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "5rem",
                }}
              >
                Need technical support or admin access? Our Admin Assistant is
                here to help!
              </p>

              <div className={`card mt-5 mb-5 ${styles.customCard}`}>
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>🔧</span> HEX Admin
                    Assistant
                  </h2>
                  <h3 className={styles.uncleSubtitle}>Your Technical Guide</h3>

                  <div className={styles.uncleDescription}>
                    <p>
                      Get help with HEX administration and technical questions!
                    </p>
                  </div>

                  <button
                    className={`btn ${
                      showAdminChatbot
                        ? "btn-outline-danger"
                        : "btn-outline-primary"
                    } ${styles.chatButton} btn-lg mt-3`}
                    onClick={() => setShowAdminChatbot(!showAdminChatbot)}
                  >
                    {showAdminChatbot ? "× Close Chat" : "💬 Chat with Admin"}
                  </button>
                </div>
              </div>

              {showAdminChatbot && (
                <div className={`card mt-4 ${styles.chatbotContainer}`}>
                  <div className="card-body p-4">
                    <Chatbot />
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
                    } ${styles.chatButton} btn-lg mt-3`}
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
                    } ${styles.chatButton} btn-lg mt-3`}
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
