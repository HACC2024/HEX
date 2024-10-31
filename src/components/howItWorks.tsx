/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

const HowItWorks: React.FC = () => {
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
    <div className="HowItWorksDiv px-5 pt-5">
      <div id="HowItWorks" className="how-it-works-section">
        <h1
          className="text-center custom-h1 AnimatedBox"
          style={{
            marginTop: "50px",
            marginBottom: "80px",
            opacity: 0,
            transform: "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          HOW IT WORKS
        </h1>

        <Row className="d-flex align-items-center">
          <Col xs={12} md={4} className="d-flex justify-content-start ps-md-5">
            <div
              className="AnimatedBox"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "all 0.5s ease 0.2s",
              }}
            >
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
              className="HowItWorksImageWrapper p-4 text-center AnimatedBox"
              style={{
                marginBottom: "80px",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "all 0.5s ease 0.4s",
              }}
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
      <Row className="d-flex justify-content-center align-items-center mt-3 pb-5">
        {[1, 2, 3].map((num, index) => (
          <Col
            key={num}
            xs={12}
            md={3}
            className="StepBox d-flex justify-content-center mb-5 ms-5 me-5"
          >
            {num === 2 ? (
              <Link
                href="Dashboard"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="AnimatedBox"
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: `opacity 0.5s ease ${
                      0.6 + index * 0.2
                    }s, transform 0.5s ease ${0.6 + index * 0.2}s`,
                  }}
                >
                  <div className="StepNumber">{num}</div>
                  <p className="StepText">GENERATE WITH OUR DASHBOARD</p>
                </div>
              </Link>
            ) : (
              <a
                href={num === 1 ? "#Category" : "#Chatbot"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  width: "100%",
                  height: "100%", // Ensures the entire box is clickable
                }}
              >
                <div
                  className="AnimatedBox"
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: `opacity 0.5s ease ${
                      0.6 + index * 0.2
                    }s, transform 0.5s ease ${0.6 + index * 0.2}s`,
                  }}
                >
                  <div className="StepNumber">{num}</div>
                  <p className="StepText">
                    {num === 1
                      ? "CHOOSE YOUR DATASET"
                      : "AUTOMATE YOUR ANALYSIS"}
                  </p>
                </div>
              </a>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HowItWorks;
