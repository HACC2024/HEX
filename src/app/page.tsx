"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';
import "../styles/styles.css";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer";
import { Container, Nav, Row, Col } from "react-bootstrap";
import {
    PeopleFill,
    BusFrontFill,
    Book,
    Briefcase,
    Shield
} from 'react-bootstrap-icons';

const HomeImage = () => (
    <div className="HomeImageCt p-0 m-0 d-flex justify-content-center align-items-center">
        <h1><strong>HAWAII OPEN DATA</strong></h1>
    </div>
);


const categoryData = [
    {name: "Community", icon: <PeopleFill className="fs-1"/>, link: "/categories.html"},
    {name: "Transportation", icon: <BusFrontFill className="fs-1"/>, link: "/categories.html"},
    {name: "School", icon: <Book className="fs-1"/>, link: "/categories.html" },
    { name: "Employment", icon: <Briefcase className="fs-1" />, link: "/categories.html" },
    { name: "Public Safety", icon: <Shield className="fs-1" />, link: "/categories.html" },
];

const Categories = () => (

        <div className="CatDiv">
            <h1 className="px-5 pt-3 text-center">DATASET CATEGORIES</h1>
            <Container className="CatContainer">
            <Row>
                {categoryData.map((category, index) => (
                    <Col key={index} className="d-flex flex-column align-items-center">
                        <Nav.Link href="/test" className="text-center">
                            <div className="CatIcons">
                                {category.icon}
                                <strong>{category.name}</strong>
                            </div>
                        </Nav.Link>
                    </Col>
                ))}
            </Row>
            </Container>
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
            <Navbar/>
            <HomeImage/>
            <Categories/>
            <IntroContainer/>
            <Footer/>
        </main>
    );
}
