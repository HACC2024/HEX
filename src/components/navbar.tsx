import React, { useState } from "react";
import Link from "next/link";
import { SunFill, MoonStarsFill } from "react-bootstrap-icons";
import "../styles.css";

const Navbar: React.FC = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleLightMode = () => {
    document.body.classList.toggle("light-mode");
    setIsLightMode(!isLightMode);
  };

  return (
    <nav className="navbar custom-navbar p-3 fixed-top">
      <div className="container-fluid d-flex align-items-center">
        <ul className="navbar-nav d-flex flex-row justify-content-center w-100 gap-4 mx-auto mt-4">
          <li className="nav-item">
            <Link href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="#Introduction">Introduction</Link>
          </li>
          <li className="nav-item">
            <Link href="#Category">Category</Link>
          </li>
          <li className="nav-item">
            <Link href="#HowItWorks">How It Works</Link>
          </li>
          <li className="nav-item">
            <Link href="#Chatbot">Chatbots</Link>
          </li>
          <li className="nav-item">
          <Link href="Dashboard">Dashboard</Link>
        </li>
        </ul>
        <div
          onClick={toggleLightMode}
          className="ms-auto darkmode-icon"
          style={{ cursor: "pointer" }}
        >
          {isLightMode ? <MoonStarsFill size={24} /> : <SunFill size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
