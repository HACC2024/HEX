"use client";
import React from "react";
import DownloadFile from "../../components/DataCards";
import UserUpload from "../../components/UserUpload";
import "../../styles/styles.css";

const TestPage = () => {
  return (
  <div>
    <h1>This is the Test AI page.</h1>
    <DownloadFile />
    <UserUpload />
  </div>
  );
};

export default TestPage;