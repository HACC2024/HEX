"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css'; 
import { Container, Nav, NavDropdown, Navbar, Row, Col } from "react-bootstrap";
import { Facebook, Twitter, Pinterest, Instagram, HouseFill, Search, PersonFill, Cart } from 'react-bootstrap-icons';
import Link from 'next/link'; // Use Next.js Link

const TopMenu = () => (
    <Navbar bg="light" expand="lg">
        <Container>
            <Nav className="me-auto">
                <Nav.Link><Facebook/></Nav.Link>
                <Nav.Link><Twitter/></Nav.Link>
                <Nav.Link><Pinterest/></Nav.Link>
                <Nav.Link><Instagram/></Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
                <Nav.Link><HouseFill/> </Nav.Link>
                <Nav.Link><Search/> </Nav.Link>
                <Nav.Link><PersonFill/> </Nav.Link>
                <NavDropdown title={<Cart/>}>
                    <NavDropdown.Item></NavDropdown.Item>
                    <NavDropdown.ItemText>Your cart is currently empty.</NavDropdown.ItemText>
                </NavDropdown>
            </Nav>
        </Container>
    </Navbar>
);

const HomeImage = () => (
    <Container className="HomeImageCt">
        {/* Add your image here if needed */}
    </Container>
);

const IntroContainer = () => (
    <h1>Introduction</h1>
);

const Categories = () => (
    <>
        <h1>Categories</h1>
        <hr />
        <Row>
            <Col>
                <Link href="/categories.html">Community</Link>
            </Col>
            <Col>
                <Link href="/categories.html">Transportation</Link>
            </Col>
            <Col>
                <Link href="/categories.html">School</Link>
            </Col>
        </Row>
    </>
);

export default function Home() {
    return (
        <main>
            <TopMenu/>
            <HomeImage/>
            <Categories/>
            <IntroContainer/>
        </main>
    );
}
