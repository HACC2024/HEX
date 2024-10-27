"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/csvReader.module.css";
import UncleChatbot from "../../components/UncleChatbot";
import { BarChart, MessageCircle } from 'lucide-react';

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

  return (
    <main className={styles.mainContainer}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="text-center mb-4">
              <h1 className={styles.title}>HEX Open Data Dashboard</h1>
            </div>

            {/* Tool 1: Data Visualizer */}
            <div className="tool-section mb-5">
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>1</div>
                <div className={styles.toolIcon}>
                  <BarChart size={24} />
                </div>
                <div className={styles.toolLabel}>Data Visualizer</div>
              </div>

              <p className={styles.subtitle} style={{ textAlign: "center", display: "block" }}>
                Upload your CSV file to create interactive visualizations and
                analyze your data.
              </p>
              
              <CsvReader />
            </div>

            {/* Tool 2: Uncle HEX Chatbot */}
            <div className="tool-section mt-5">
              <div className={styles.toolBadge}>
                <div className={styles.numberCircle}>2</div>
                <div className={styles.toolIcon}>
                  <MessageCircle size={24} />
                </div>
                <div className={styles.toolLabel}>AI Assistant</div>
              </div>

              <p className={styles.subtitle} style={{ textAlign: "center", display: "block" }}>
                Need help understanding your data?
                We are here to assist with your data analysis journey!
              </p>

              <div className="card mt-4">
                <div className="card-body text-center py-4">
                  <h2 className={styles.uncleTitle}>
                    <span className={styles.wavingHand}>👋</span> Meet Uncle HEX
                  </h2>
                  <h3 className={styles.uncleSubtitle}>Your Local Data Scientist</h3>
                  
                  <div className={styles.uncleDescription}>
                    <p>I can read CSV, JSON, XML, and RDF Files!</p>
                  </div>

                  <button 
                    className={`btn ${showChatbot ? 'btn-outline-danger' : 'btn-outline-primary'} btn-lg mt-3`}
                    onClick={() => setShowChatbot(!showChatbot)}
                  >
                    {showChatbot ? '× Close Chat' : '💬 Chat with Uncle HEX'}
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
          </div>
        </div>
      </div>
    </main>
  );
}