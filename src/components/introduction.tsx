/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import "../styles.css";
import { Col, Row } from "react-bootstrap";

const Introduction: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const boxes = document.querySelectorAll(".IntroBox");
    let lastScrollY = window.scrollY;

    let isScrolling: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Debounce the scroll event to prevent rapid toggling
      window.clearTimeout(isScrolling);
      isScrolling = window.setTimeout(() => {
        if (currentScrollY > lastScrollY) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY = currentScrollY;
      }, 100); // Wait 100ms after scrolling to handle the event
    };

    // Observer for scroll into view - Add 'show' class only once
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Unobserve the box after the animation has been triggered once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: "0px 0px -100px 0px", // Buffer area to trigger the animation earlier
      }
    );

    boxes.forEach((box) => {
      observer.observe(box);
    });

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup observer and scroll event
    return () => {
      window.removeEventListener("scroll", handleScroll);
      boxes.forEach((box) => observer.unobserve(box));
    };
  }, []);

  return (
    <div id="Introduction" className="IntroDiv px-5 pt-5">
      <Row className="d-flex justify-content-center align-items-center gap-2">
        <Col
          xs={12}
          md={3}
          className="d-flex flex-column align-items-center mb-4"
        >
          {/* Box 1 */}
          <div
            className="IntroBox p-4 text-center border card-shadow"
            data-box="1"
          >
            <h3 style={{ color: "#b4d5ff" }}>Box 1</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              in rhoncus quam, sit amet tincidunt urna.
            </p>
          </div>
        </Col>
        <Col
          xs={12}
          md={3}
          className="d-flex flex-column align-items-center mb-4"
        >
          {/* Box 2 */}
          <div
            className="IntroBox p-4 text-center border card-shadow"
            data-box="2"
          >
            <h3 style={{ color: "#b4d5ff" }}>Box 2</h3>
            <p>
              Cras sit amet ex vel tortor luctus suscipit. Morbi pellentesque
              consequat lectus, quis cursus nisi feugiat quis.
            </p>
          </div>
        </Col>
        <Col
          xs={12}
          md={3}
          className="d-flex flex-column align-items-center mb-4"
        >
          {/* Box 3 */}
          <div
            className="IntroBox p-4 text-center border card-shadow"
            data-box="3"
          >
            <h3 style={{ color: "#b4d5ff" }}>Box 3</h3>
            <p>
              Etiam molestie risus sed quam fermentum vehicula. Vestibulum
              lacinia fringilla bibendum. Fusce feugiat tincidunt sodales.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Introduction;
