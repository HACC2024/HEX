/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import "../styles.css";

const ChatBotsDesign: React.FC = () => {
  const handleNavigation = () => {
    window.location.href = "/Dashboard";
  };

  useEffect(() => {
    const boxes = document.querySelectorAll(".AnimatedBox");
    
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    boxes.forEach((box) => {
      observer.observe(box);
    });

    return () => {
      boxes.forEach((box) => observer.unobserve(box));
    };
  }, []);

  return (
    <div id="Chatbot" className="FullPageBackground">
      <h1 
        className="custom-h1 text-center AnimatedBox mt-5" 
        style={{ 
          marginBottom: "30px",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "all 0.5s ease"
        }}
      >
        PERSONALIZED CHATBOTS
      </h1>

      <div
        className="mt-4 AnimatedBox"
        style={{ 
          display: "flex", 
          justifyContent: "center",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "all 0.5s ease 0.2s",
          position: "relative"  // Changed to relative
        }}
      >
        <button
          onClick={handleNavigation}
          className="btn btn-primary gradient-button mx-2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            padding: "10px 20px",
            marginBottom: "50px",
          }}
        >
          Try It Out!
        </button>
      </div>

      <div className="ChatBotsContainer">
        {/* Top Row */}
        <div className="Row TopRow">
          <div 
            className="Box LargeBox d-flex flex-column align-items-center AnimatedBox"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.5s ease 0.4s"
            }}
          >
            <img src="/AI.jpg" alt="AI" className="AI-image" />
            <h3 className="fw-bold" style={{ marginTop: "30px", textAlign: "center", fontSize: "25px" }}>
              TAILORED RESPONSES FOR YOUR NEEDS
            </h3>
          </div>
          <div 
            className="Box SmallBox smallBoxText AnimatedBox"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.5s ease 0.6s",
              fontSize: "20px"
            }}
          >
            DONWLOAD,
            <br />
            UPLOAD,
            <br />
            INQUIRE,
            <br />
            ANALYZE
            <br /> 
            INSTANTLY!
          </div>
        </div>
        {/* Bottom Row */}
        <div className="Row BottomRow">
          <div 
            className="Box MediumBox-left d-flex flex-column align-items-center justify-content-center AnimatedBox"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.5s ease 0.8s"
            }}
          >
            <h3 className="fw-bold text-center mt-5 mb-4">
              Generate Graphs
              <br />
              With Our Data Visualizer
            </h3>
            <div className="bar-chart">
              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
            </div>
          </div>
          <div 
            className="Box MediumBox-right d-flex flex-column align-items-center AnimatedBox"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.5s ease 1s"
            }}
          >
            <img
              src="/text.png"
              alt="Text"
              className="Text-image"
              style={{ marginTop: "15px" }}
            />
            <h3 className="fw-bold" style={{ marginTop: "-15px" }}>
              Quick Answers,
              <br />
              Just Like a Text!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotsDesign;