"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import '../src/styles.css'; 
import { useRouter } from 'next/router';
import { Container, Nav, NavDropdown, Navbar, Row, Col } from "react-bootstrap";
import  DownloadCSVFiles from "../src/components/DataCards";


const DataContent = ({ category }: { category: 'community' | 'transportation' | 'school' }) => {

    const categoryToCap = {
        community: "Community",
        transportation: "Transportation",
        school: "School",
    }
    return (
        <div>
            <h1>{categoryToCap[category]}</h1>
            <DownloadCSVFiles category= {categoryToCap[category]}/>
        </div>
    )

}


export default function CategoriesPage() {
    const router = useRouter();
    const { category } = router.query;

    if (typeof category === 'string' && ['community', 'transportation', 'school'].includes(category)) {
        return (
            <div>
                <DataContent category={category as 'community' | 'transportation' | 'school'} />
            </div>
        );
    } else {
        return <div>Invalid category</div>;
    }
}
