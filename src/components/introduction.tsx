import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

const Introduction: React.FC = () => {
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
        threshold: 0.2,  // Lower threshold for earlier triggering
        rootMargin: "0px 0px -50px 0px",  // Adjusted margin for smoother trigger
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
    <div className="IntroDiv px-4 pt-5">
      <Row className="d-flex justify-content-center align-items-stretch gap-md-4 gap-2">
        <Col
          xs={12}
          lg={3}
          md={5}
          className="d-flex flex-column align-items-center"
        >
          <div
            className="IntroBox p-4 text-center border card-shadow mt-4 AnimatedBox"
            data-box="1"
            style={{ 
              maxWidth: "400px", 
              width: "100%",
              opacity: 0,
              transform: "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <h3 style={{ color: "#b4d5ff", fontSize: "25px" }}>
              Free AI Tools
            </h3>
            <p>
              Unlock the power of data with personalized Pidgin Chatbots! Uncle
              HEX dives into insights and analysis, while HEX Admin Assistant
              manages your data hub and tackles technical queries—all powered by
              the cutting-edge Groq Llama3-8b-8192.
            </p>
          </div>
        </Col>

        <Col
          xs={12}
          lg={3}
          md={5}
          className="d-flex flex-column align-items-center"
        >
          <div
            className="IntroBox p-4 text-center border card-shadow mt-4 AnimatedBox"
            data-box="2"
            style={{ 
              maxWidth: "400px", 
              width: "100%",
              opacity: 0,
              transform: "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
            }}
          >
            <h3 style={{ color: "#b4d5ff", fontSize: "25px" }}>
              Visual Generators
            </h3>
            <p>
              Visualize graphs and refine data instantly for peak performance.
              Effortlessly export polished datasets and charts, enabling
              seamless AI collaboration. With customizable charts, you can share
              insights with clarity for any audience.
            </p>
          </div>
        </Col>

        <Col
          xs={12}
          lg={3}
          md={5}
          className="d-flex flex-column align-items-center"
        >
          <div
            className="IntroBox p-4 text-center border card-shadow mt-4 AnimatedBox"
            data-box="3"
            style={{ 
              maxWidth: "400px", 
              width: "100%",
              opacity: 0,
              transform: "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
            }}
          >
            <h3 style={{ color: "#b4d5ff", fontSize: "25px" }}>
              Centralized Data
            </h3>
            <p>
              Experience a new era of data shopping with our intuitive UI/UX,
              crafted for effortless navigation. Our powerful filter and search
              feature lets you explore all your datasets on a single page—like a marketplace, making data access fast and simple.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Introduction;