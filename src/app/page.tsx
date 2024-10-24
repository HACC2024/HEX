/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';
import "../styles/styles.css";
import { Container, Row, Col } from "react-bootstrap";
import { PeopleFill, BusFrontFill, Book, Briefcase, Shield } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import Link from "next/link";
import Footer from "../components/footer";
import Navbar from "../components/navbar";



const HomeImage = () => (
    <div className="HomeImageCt p-0 m-0 d-flex justify-content-center align-items-center">
        <h1><strong>HAWAII OPEN DATA</strong></h1>
    </div>
);

const categoryData = [
    { name: "Community", icon: <PeopleFill className="fs-1" />, link: "/Categories/community" },
    { name: "Transportation", icon: <BusFrontFill className="fs-1" />, link: "/Categories/transportation" },
    { name: "School", icon: <Book className="fs-1" />, link: "/Categories/school" },
    { name: "Employment", icon: <Briefcase className="fs-1" />, link: "/Categories/employment" },
    { name: "Public Safety", icon: <Shield className="fs-1" />, link: "/Categories/publicSafety" },
];

const Categories = () => (
    <div style={{ backgroundColor: '#f0f2ff', padding: '20px' }}>
        <div className="CatDiv">
            <h1 className="px-5 pt-3 text-center mt-5">DATASET CATEGORIES</h1>
            <Container className="CatContainer">
                <div className="BigCircle">Categories</div>
                <Row>
                    {categoryData.map((category, index) => (
                        <Col key={index} className="d-flex flex-column align-items-center">
                            <Link href={category.link} className="text-center custom-link">
                                <div className={`CatIcons position-circle${index + 1}`}>
                                    {category.icon}
                                    <strong>{category.name}</strong>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    </div>
);

const IntroContainer = () => {
    const [scrollDirection, setScrollDirection] = useState('down');

    useEffect(() => {
        const boxes = document.querySelectorAll('.IntroBox');
        let lastScrollY = window.scrollY;


        let isScrolling: number;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Debounce the scroll event to prevent rapid toggling
            window.clearTimeout(isScrolling);
            isScrolling = window.setTimeout(() => {
                if (currentScrollY > lastScrollY) {
                    setScrollDirection('down');
                } else {
                    setScrollDirection('up');
                }
                lastScrollY = currentScrollY;
            }, 100); // Wait 100ms after scrolling to handle the event
        };

        // Observer for scroll into view - Add 'show' class only once
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        // Unobserve the box after the animation has been triggered once
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible
                rootMargin: '0px 0px -100px 0px', // Buffer area to trigger the animation earlier
            }
        );

        boxes.forEach((box) => {
            observer.observe(box);
        });

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup observer and scroll event
        return () => {
            window.removeEventListener('scroll', handleScroll);
            boxes.forEach((box) => observer.unobserve(box));
        };
    }, []);

    return (
        <div id="Introduction" className="IntroDiv px-5 pt-5">
            <Row className="d-flex justify-content-center align-items-center gap-2">
                <Col xs={12} md={3} className="d-flex flex-column align-items-center mb-4">

                    {/* Box 1 */}
                    <div className="IntroBox p-4 text-center border card-shadow" data-box="1">
                        <h3 style={{ color: '#b4d5ff' }}>Box 1</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in rhoncus quam, sit amet tincidunt urna.</p>
                    </div>
                </Col>
                <Col xs={12} md={3} className="d-flex flex-column align-items-center mb-4">

                    {/* Box 2 */}
                    <div className="IntroBox p-4 text-center border card-shadow" data-box="2">
                        <h3 style={{ color: '#b4d5ff' }}>Box 2</h3>
                        <p>Cras sit amet ex vel tortor luctus suscipit. Morbi pellentesque consequat lectus, quis cursus nisi feugiat quis.</p>
                    </div>
                </Col>
                <Col xs={12} md={3} className="d-flex flex-column align-items-center mb-4">

                    {/* Box 3 */}
                    <div className="IntroBox p-4 text-center border card-shadow" data-box="3">
                        <h3 style={{ color: '#b4d5ff' }}>Box 3</h3>
                        <p>Etiam molestie risus sed quam fermentum vehicula. Vestibulum lacinia fringilla bibendum. Fusce feugiat tincidunt sodales.</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const HowItWorks = () => {
    useEffect(() => {
        const howItWorksBoxes = document.querySelectorAll('.HowItWorksBox');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        howItWorksBoxes.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            howItWorksBoxes.forEach((element) => observer.unobserve(element));
        };
    }, []);

    return (
        <div id="HowItWorks" className="HowItWorksDiv px-5 pt-5" style={{ marginTop: '20px' }}>
            <div className="how-it-works-section">

                <h1 className="text-center" style={{ marginTop: '50px', marginBottom: '80px' }}>How It Works</h1>

                <Row className="d-flex align-items-center">
                    <Col xs={12} md={4} className="d-flex justify-content-start ps-md-5">
                        <div>

                            <h1 className="custom-heading">ABCDEFG</h1>
                            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.</h4>
                        </div>
                    </Col>

                    <Col xs={12} md={8} className="d-flex justify-content-end ps-md-8">
                        <div className="HowItWorksImageWrapper p-4 text-center" style={{ marginBottom: '80px' }}>
                            <img
                                src="https://t3.ftcdn.net/jpg/03/29/17/78/360_F_329177878_ij7ooGdwU9EKqBFtyJQvWsDmYSfI1evZ.jpg"
                                alt="How It Works Image 1"
                                className="HowItWorksImage"
                                style={{ width: '70%', height: 'auto' }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className="d-flex justify-content-center align-items-center mt-5 pb-5">
                <Col xs={12} md={{ span: 5, offset: 0 }} className="d-flex flex-column align-items-center mb-4">
                    <div className="stepsbox p-5 d-flex flex-column justify-content-start w-100">

                        <div className="d-flex flex-column align-items-start w-100">
                            <div className="d-flex align-items-center circlenumber-container">
                                <div className="circlenumber d-flex justify-content-center align-items-center">1</div>
                                <span className="ms-3 steps-text">Lorem ipsum dolor sit amet</span>
                            </div>
                            <div className="d-flex align-items-center circlenumber-container">
                                <div className="circlenumber d-flex justify-content-center align-items-center">2</div>
                                <span className="ms-3 steps-text">Lorem ipsum dolor sit amet</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="circlenumber d-flex justify-content-center align-items-center">3</div>
                                <span className="ms-3 steps-text">Lorem ipsum dolor sit amet</span>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={{ span: 4, offset: 0 }} className="d-flex flex-column align-items-center mb-4">
                    <img
                        src="https://t3.ftcdn.net/jpg/03/29/17/78/360_F_329177878_ij7ooGdwU9EKqBFtyJQvWsDmYSfI1evZ.jpg"
                        alt="HowItWorksImage2"
                        className="second-img"
                    />

                    <div className="HowItWorksBox mt-4"> {/* Adds top margin to Box 4 */}
                        <div className="d-flex flex-column justify-content-start w-100">
                            <div className="d-flex align-items-center">
                                <span className="ms-3">Box 4</span>
                            </div>
                        </div>
                    </div>
                </Col>

            </Row>
        </div>
    );
};

export default function Home() {
    return (
        <main>
            <Navbar/>
            <HomeImage/>
            <Categories/>
            <IntroContainer/>
            <HowItWorks/>
            <Footer />
        </main>
    );
}
