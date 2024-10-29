
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles.css";
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import  DownloadCSVFiles from "../../../components/DataCards";


export async function generateStaticParams() {
    // Define the categories you want to statically generate
    const categories = ['community', 'transportation', 'school', 'employment', 'publicSafety'];
    
    return categories.map(category => ({
        category,
    }));
}

const DataContent = ({ category }: { category: 'community' | 'transportation' | 'school' | 'employment' | 'publicSafety' }) => {
    const categoryToCap = {
        community: "Community",
        transportation: "Transportation",
        school: "School",
        employment: "Employment",
        publicSafety: "Public Safety",
    }
    return (
        <div>
            <a href="../">
                <ArrowLeftCircleFill />
                Back to Home
            </a>
            <h1>{categoryToCap[category]}</h1>
            <DownloadCSVFiles category= {categoryToCap[category]}/>
        </div>
    )
}

// Define a server component that accepts category as a parameter
export default function CategoriesPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  return (
    <DataContent category={category as 'community' | 'transportation' | 'school' | 'employment' | 'publicSafety'} />
  );
}