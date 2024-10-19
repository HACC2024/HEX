import React from "react";
import "../styles/styles.css";
import { Container, Nav } from "react-bootstrap";
import Link from "next/link";
import {
    Instagram,
    Globe,
    Linkedin,
} from 'react-bootstrap-icons';

const Footer: React.FC = () => {
    return (
        <footer>
            <Container>
                <Nav className="d-flex justify-content-between w-100">
                    {/* Social Media Icons (left-aligned) */}
                    <Nav className="d-flex">
                        <Nav.Link href="https://www.linkedin.com/company/haumanaexchange/" target="_blank"><Linkedin/></Nav.Link>
                        <Nav.Link href="https://www.haumanaexchange.org/" target="_blank"><Globe/></Nav.Link>
                        <Nav.Link href="https://www.instagram.com/haumanaexchange" target="_blank"><Instagram/></Nav.Link>
                    </Nav>

                    {/* Right-aligned Section */}
                    <Nav>
                        <Link href="Admin" className="custom-link">
                            Admin Portal
                        </Link>
                    </Nav>
                </Nav>
            </Container>
        </footer>
    );
};


export default Footer;
