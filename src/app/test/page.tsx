"use client";
import React from "react";
import DownloadCSVFiles from "../../components/DataCards";
import UserUpload from "../../components/UserUpload";
import "../../styles/styles.css";

const TestPage = () => {
  return (
  <div>
    <h1>This is the Test AI page.</h1>
    <DownloadCSVFiles />
    <UserUpload />
  </div>
  );
};

export default TestPage;