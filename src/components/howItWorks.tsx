/* eslint-disable @next/next/no-img-element */
import React from "react";
import "../styles.css";
import { Col, Row } from "react-bootstrap";

const HowItWorks: React.FC = () => {
  return (
    <div id="HowItWorks" className="HowItWorksDiv px-5 pt-5">
      <div className="how-it-works-section">
        <h1
          className="text-center custom-h1"
          style={{ marginTop: "50px", marginBottom: "80px" }}
        >
          HOW IT WORKS
        </h1>

        <Row className="d-flex align-items-center">
          <Col xs={12} md={4} className="d-flex justify-content-start ps-md-5">
            <div>
              <h1 className="custom-heading">
                Here is to new insights and experiences
              </h1>
              <h4 className="custom-h4">
                Experience a quick overview of what is in store for you
              </h4>
            </div>
          </Col>

          <Col xs={12} md={8} className="d-flex justify-content-end ps-md-8">
            <div
              className="HowItWorksImageWrapper p-4 text-center"
              style={{ marginBottom: "80px" }}
            >
              <img
                src="https://t3.ftcdn.net/jpg/03/29/17/78/360_F_329177878_ij7ooGdwU9EKqBFtyJQvWsDmYSfI1evZ.jpg"
                alt="How It Works Image 1"
                className="HowItWorksImage"
                style={{ width: "70%", height: "auto" }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Row className="d-flex justify-content-center align-items-center mt-5 pb-5">
        <Col xs={12} md={3} className="d-flex justify-content-center">
          <div className="StepBox">
            <div className="StepNumber">1</div>
            <p className="StepText">PICK YOUR CATEGORY</p>
          </div>
        </Col>
        <Col xs={12} md={3} className="d-flex justify-content-center">
          <div className="StepBox">
            <div className="StepNumber">2</div>
            <p className="StepText">CHOOSE YOUR DATASET</p>
          </div>
        </Col>
        <Col xs={12} md={3} className="d-flex justify-content-center">
          <div className="StepBox">
            <div className="StepNumber">3</div>
            <p className="StepText">ASK AI TO LEARN MORE!</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HowItWorks;
