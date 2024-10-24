/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../src/styles.css'; 
import { useRouter } from 'next/router';
import { Container } from "react-bootstrap";

const TopMenu = ({ category }: { category: string }) => {
    const content = {
        community: "Category Page for Community",
        transportation: "Category Page for Transportation", 
        school: "Category Page for School",
    };

    // Check if category is defined to avoid errors
    // const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Categories";

    return (
        <div>
            <h1>{content[category as keyof typeof content]}</h1>
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

const DataContent = ({ category }: { category: string }) => {
    const contentMap = {
        community: <CommunityContent/>,
        transportation: <TransportationContent/>,
        school: <SchoolContent/>,
    }
    return (
        <div>
            {contentMap[category as keyof typeof contentMap]}
        </div>
    )

}


export default function CategoriesPage() {
    const router = useRouter();
    const { category } = router.query;
    const categoryStr = Array.isArray(category) ? category[0] : category || '';

    return (
        <div>
            <TopMenu category={categoryStr} />
            <DataContent category={categoryStr} />
        </div>
    );
}
