import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles.css";
import { Container } from "react-bootstrap";

export async function generateStaticParams() {
    // Define the categories you want to statically generate
    const categories = ['community', 'transportation', 'school', 'employment', 'publicSafety'];
    
    return categories.map(category => ({
        category,
    }));
}

// Define a server component that accepts category as a parameter
export default function CategoriesPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  // Define the content map for different categories
  const contentMap: { [key: string]: JSX.Element } = {
    community: <CommunityContent />,
    transportation: <TransportationContent />,
    school: <SchoolContent />,
    employment: <EmploymentContent />,
    publicSafety: <PublicSafetyContent />,
  };

  return (
    <div>
      <TopMenu category={category} />
      <div>
        {contentMap[category] || <DefaultContent />}{" "}
        {/* Display default content if category is invalid */}
      </div>
    </div>
  );
}

const TopMenu = ({ category }: { category: string }) => {
  const content: { [key: string]: string } = {
    community: "Category Page for Community",
    transportation: "Category Page for Transportation",
    school: "Category Page for School",
    employment: "Category Page for Employment",
    publicSafety: "Category Page for Public Safety",
  };

  return (
    <div>
      <h1>{content[category] || "Category Not Found"}</h1>
      <hr />
    </div>
  );
};

// Individual content components
const CommunityContent = () => (
  <div>
    <h1>Community Content</h1>
    <Container className="CatContentDiv">
      <p className="text-white">Community Data Goes here</p>
    </Container>
  </div>
);

const TransportationContent = () => (
  <div>
    <h1>Transportation Content</h1>
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

const EmploymentContent = () => (
  <div>
    <h1>Employment Content</h1>
    <Container className="CatContentDiv">
      <p className="text-white">Employment Data Goes here</p>
    </Container>
  </div>
);

const PublicSafetyContent = () => (
  <div>
    <h1>Public Safety Content</h1>
    <Container className="CatContentDiv">
      <p className="text-white">Public Safety Data Goes here</p>
    </Container>
  </div>
);

const DefaultContent = () => (
  <div>
    <h1>No category selected</h1>
    <Container className="CatContentDiv">
      <p className="text-white">Please select a category.</p>
    </Container>
  </div>
);
