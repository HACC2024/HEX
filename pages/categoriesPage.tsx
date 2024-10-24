"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../src/styles.css'; 
import { useRouter } from 'next/router';
import { Container, Nav, NavDropdown, Navbar, Row, Col } from "react-bootstrap";

const TopMenu = ({ category }) => {
    const content = {
        community: "Category Page for Community",
        transportation: "Category Page for Transportation", 
        school: "Category Page for School",
    };

    // Check if category is defined to avoid errors
    const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Categories";

    return (
        <div>
            <h1>{content[category]}</h1>
            <hr/>
        </div>
    );
};

const CommunityContent = () => (
    <div>
        <h1>Community Content</h1>
        <Container className="CatContentDiv">
            <p className="text-white">Community Data Goes here</p>
        </Container>
    </div>
);
const TransportationContent= () => (
    <div>
        <h1>Tranpsortation Content</h1>
        <Container className="CatContentDiv">
            <p className="text-white">Transportation Data Goes here</p>
        </Container>
    </div>
);

const SchoolContent = () => (
    <div>
        <h1>School Content</h1>
        <Container className="CatContentDiv">
            <p className="text-white">School Data Goes here</p>
        </Container>
    </div>
);

const DataContent = ({ category }) => {
    const contentMap = {
        community: <CommunityContent/>,
        transportation: <TransportationContent/>,
        school: <SchoolContent/>,
    }
    return (
        <div>
            {contentMap[category]}
        </div>
    )

}


export default function CategoriesPage() {
    const router = useRouter();
    const { category } = router.query;

    return (
        <div>
            <TopMenu category={category} />
            <DataContent category={category} />
        </div>
    );
}
