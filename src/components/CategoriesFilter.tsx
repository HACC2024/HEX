"use client";

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { PeopleFill, BusFrontFill, Book, Briefcase, Shield } from 'react-bootstrap-icons';
import Link from 'next/link';
import '../styles/CategoriesFilter.Style.css';
import AISticker from './AISticker';
import "../styles.css";

const categoryData = [
    { name: "Community", icon: <PeopleFill className="fs-3" />, link: "/Categories/community" },
    { name: "Transportation", icon: <BusFrontFill className="fs-3" />, link: "/Categories/transportation" },
    { name: "School", icon: <Book className="fs-3" />, link: "/Categories/school" },
    { name: "Employment", icon: <Briefcase className="fs-3" />, link: "/Categories/employment" },
    { name: "Public Safety", icon: <Shield className="fs-3" />, link: "/Categories/publicSafety" },
];

const CategoriesFilter = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        // set the active category based on the current window location
        const currentPath = window.location.pathname;
        const activeLink = categoryData.find(category => category.link === currentPath);
        if (activeLink) {
            setActiveCategory(activeLink.link);
        }
    }, []);

    const handleLinkClick = (link: string) => {
        setActiveCategory(link); // updates the active underline based on the link it's currently on
    };

    return (
        <div style={{ backgroundColor: '#e8e8e8', padding: '15px' }}>
            <div className="CatFilterDiv">
                <Container className="CatFilterContainer">
                    <Row>
                        {categoryData.map((category, index) => (
                            <Col key={index} className="align-items-center">
                                <Link 
                                    href={category.link} 
                                    className={`text-center custom-link ${activeCategory === category.link ? 'clicked' : ''}`} 
                                    onClick={() => handleLinkClick(category.link)}
                                >
                                    <div>
                                        {category.icon}
                                        <strong className="px-3">{category.name}</strong>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <AISticker />
            </div>
        </div>
    );
};

export default CategoriesFilter;
