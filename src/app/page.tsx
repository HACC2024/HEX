"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css'; 
import { Container, Nav, NavDropdown, Navbar, Row, Col } from "react-bootstrap";
import { Facebook, Twitter, PeopleFill, Pinterest, Instagram, HouseFill, Search, PersonFill, Cart, BusFrontFill, Book } from 'react-bootstrap-icons'; 
import { useEffect, useState } from 'react';

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
                        <h3>Box 1</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in rhoncus quam, sit amet tincidunt urna.</p>
                    </div>
                </Col>
                <Col xs={12} md={3} className="d-flex flex-column align-items-center mb-4">
                    
                    {/* Box 2 */}
                    <div className="IntroBox p-4 text-center border card-shadow" data-box="2">
                        <h3>Box 2</h3>
                        <p>Cras sit amet ex vel tortor luctus suscipit. Morbi pellentesque consequat lectus, quis cursus nisi feugiat quis.</p>
                    </div>
                </Col>
                <Col xs={12} md={3} className="d-flex flex-column align-items-center mb-4">
                    
                    {/* Box 3 */}
                    <div className="IntroBox p-4 text-center border card-shadow" data-box="3">
                        <h3>Box 3</h3>
                        <p>Etiam molestie risus sed quam fermentum vehicula. Vestibulum lacinia fringilla bibendum. Fusce feugiat tincidunt sodales.</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};


const HowItWorks = () => {
    const [scrollDirection, setScrollDirection] = useState('down');
    const [boxVisible, setBoxVisible] = useState(false); // Track visibility of the larger box

    useEffect(() => {
        const howItWorksBoxes = document.querySelectorAll('.HowItWorksBox');
        const biggerBox = document.querySelector('.BiggerBox');

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }

            lastScrollY = currentScrollY;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    } else {
                        entry.target.classList.remove('show');
                    }
                });
            },
            { threshold: 0.3 } // Trigger the animation when 30% of the element is visible
        );

        howItWorksBoxes.forEach((element) => {
            observer.observe(element);
        });

        const largerBoxObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setBoxVisible(true);
                    }
                });
            },
            { threshold: 0.3 } // Trigger the animation when 30% of the box is visible
        );

        if (biggerBox) {
            largerBoxObserver.observe(biggerBox);
        }

        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (biggerBox) largerBoxObserver.unobserve(biggerBox);
        };
    }, []);

    return (
        <div id="HowItWorks" className={`HowItWorksDiv px-5 pt-5 ${scrollDirection === 'up' ? 'scroll-up' : 'scroll-down'}`} style={{ marginTop: '20px' }}>
            <h1 className="text-start" style={{ marginLeft: '20px' }}>How It Works</h1>


            <Row className="d-flex justify-content-center align-items-center">
                <Col xs={12} md={4} className={`d-flex flex-column align-items-center ${scrollDirection === 'up' ? 'scroll-up' : 'scroll-down'}`} style={{ marginTop: '5px' }}>
                    {/* Box 4 */}
                    <div className="HowItWorksBox p-4 text-center border card-shadow mb-5" style={{ marginLeft: '60px', marginBottom: '60px' }}>
                        <h3>Box 4</h3>
                        <p>Box 4 Description</p>
                    </div>

                    {/* Box 5 */}
                    <div className="HowItWorksBox p-4 text-center border card-shadow mb-5" style={{ marginRight: '-90px', marginBottom: '30px' }}>
                        <h3>Box 5</h3>
                        <p>Box 5 Description</p>
                    </div>
                </Col>
                {/* How it works image 1 */}
                <Col xs={12} md={8} className="d-flex justify-content-center align-items-center">
                    <div className="HowItWorksImageWrapper p-4 text-center">
                        <img
                            src="https://www.wallart.com/media/catalog/product/cache/871f459736130e239a3f5e6472128962/w/0/w05109-small.jpg"
                            alt="How it works image"
                            className="HowItWorksImage"
                        />
                    </div>
                </Col>

                {/* How it works image 2 */}
                <Row className="d-flex justify-content-center align-items-center mt-5">
                    {/* Left Image without Box */}
                    <Col xs={12} md={5} className="d-flex flex-column align-items-center mb-4 mx-auto">
                        <img
                            src="https://www.wallart.com/media/catalog/product/cache/871f459736130e239a3f5e6472128962/w/0/w05109-small.jpg"
                            alt="HowItWorksImage2"
                            style={{ maxWidth: '100%', height: '400px', borderRadius: '12px' }}
                        />
                    </Col>

                    {/* Box 6 */}
                    <Col xs={12} md={5} className={`d-flex flex-column align-items-center mb-4 mx-auto ${boxVisible ? 'animate-box-up' : ''}`}>
                        <div className="BiggerBox p-5 text-center">
                            <h3>Box 6</h3>
                            <p>Box 6 Description</p>
                        </div>
                    </Col>
                </Row>
            </Row>
        </div>
    );
};



export default function Home() {
    return (
        <main>
            <TopMenu/>
            <HomeImage/>
            <Categories/>
            <IntroContainer/>
            <HowItWorks/>
        </main>
    );
}
