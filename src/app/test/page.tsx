"use client";
import React from "react";
import DownloadCSVFiles from "../../components/DataCards";
import UserUpload from "../../components/UserUpload";
import Chatbot from "../../components/Chatbot";
import UncleChatbot from "../../components/UncleChatbot";
import "../../styles/styles.css";

const TestPage = () => {
  return (
    <div>
      <h1>This is the Test AI page.</h1>
      <DownloadCSVFiles category="Transportation" />
      <Chatbot />
      <UserUpload />
      <UncleChatbot />
    </div>
  );
};

export default TestPage;
