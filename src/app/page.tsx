"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css'; 
import { Container, Nav, NavDropdown, Navbar, Row, Col } from "react-bootstrap";
import { Facebook, Twitter, PeopleFill, Pinterest, Instagram, HouseFill, Search, PersonFill, Cart, BusFrontFill, Book  } from 'react-bootstrap-icons';

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
                <Nav.Link href="#Introduction">Introduction</Nav.Link>
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
    <div className="HomeImageCt p-0 m-0 d-flex justify-content-center align-items-center">
        <h1><strong>HAWAII OPEN DATA</strong></h1>
    </div>
);


const Categories = () => (
    <div className="CatDiv">
        <h1 className="px-5 pt-3">Categories</h1>
        <hr/>
        <Row>
            <Col className="d-flex flex-column align-items-center">
                <Nav.Link href="/categories.html" className="text-center">
                    <div className="CatIcons">
                        <PeopleFill className="fs-1"/>
                        <strong>Community</strong>
                    </div>
                </Nav.Link>
            </Col>
            <Col className="d-flex flex-column align-items-center">
                <Nav.Link href="/categories.html" className="text-center">
                    <div className="CatIcons">
                        <BusFrontFill className="fs-1"/>
                        <strong>Transportation</strong>
                    </div>
                </Nav.Link>
            </Col>
            <Col className="d-flex flex-column align-items-center">
                <Nav.Link href="/categories.html" className="text-center">
                    <div className="CatIcons">
                        <Book className="fs-1"/>
                        <strong>School</strong>
                    </div>
                </Nav.Link>
            </Col>
        </Row>
    </div>
);

const IntroContainer = () => (
    <div id="Introduction"className="IntroDiv">
        <h1 className="px-5 pt-3">Introduction</h1>
        <hr />
        <Row>
            <Col className="d-flex flex-column align-items-center">
                <p>This is our introduction/how it works/ how it works.
                <br/>
                This is our introduction/how it works/ how it works.<br/>
                This is our introduction/how it works/ how it works.<br/>
                This is our introduction/how it works/ how it works.<br/>
                This is our introduction/how it works/ how it works.<br/>
                This is our introduction/how it works/ how it works.
                </p>
            </Col>
        </Row>
   
    </div>
    
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
