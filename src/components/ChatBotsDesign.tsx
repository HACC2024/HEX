/* eslint-disable @next/next/no-img-element */
import React from "react";
import "../styles.css";

const ChatBotsDesign: React.FC = () => {
  const handleNavigation = () => {
    window.location.href = "/test";
  };

  return (
    <div id="Chatbot" className="FullPageBackground">
      <h1 className="custom-h1 text-center" style={{ marginBottom: "30px" }}>
        ASK CHATBOTS
      </h1>

      {/* Get Started Button with Full Reload */}
      <div
        className="button-container mt-4"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={handleNavigation}
          className="btn btn-primary mx-2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            padding: "10px 20px",
            marginBottom: "50px",
          }}
        >
          Get Started
        </button>
      </div>

      <div className="ChatBotsContainer">
        {/* Top Row */}
        <div className="Row TopRow">
          <div className="Box LargeBox d-flex flex-column align-items-center">
            <img src="/AI.jpg" alt="AI" className="AI-image" />
            <h3 className="fw-bold" style={{ marginTop: "30px" }}>
              ABC
            </h3>
          </div>
          <div className="Box SmallBox smallBoxText">
            ASK,
            <br />
            VISUALIZE,
            <br />
            UNDERSTAND
            <br /> INSTANTLY!
          </div>
        </div>
        {/* Bottom Row */}
        <div className="Row BottomRow">
          <div className="Box MediumBox-left d-flex flex-column align-items-center justify-content-center">
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
          <div className="Box MediumBox-right d-flex flex-column align-items-center">
            <img
              src="/text.png"
              alt="Text"
              className="Text-image"
              style={{ marginTop: "20px" }}
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
