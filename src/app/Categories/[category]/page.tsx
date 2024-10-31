import "bootstrap/dist/css/bootstrap.min.css";
// import "../../../styles.css";
import "../../../styles/CategoriesPage.Style.css";
import DownloadCSVFiles from "../../../components/DataCards";
import CategoriesFilter from "../../../components/CategoriesFilter";
import CategoryNav from "../../../components/CategoryNav";

export async function generateStaticParams() {
  const categories = [
    "community",
    "transportation",
    "school",
    "employment",
    "publicSafety",
  ];

  return categories.map((category) => ({
    category,
  }));
}

const DataContent = ({
  category,
}: {
  category:
    | "community"
    | "transportation"
    | "school"
    | "employment"
    | "publicSafety";
}) => {
  const categoryToCap = {
    community: "Community",
    transportation: "Transportation",
    school: "School",
    employment: "Employment",
    publicSafety: "Public Safety",
  };
  return (
    <div className="dataContentDiv">
      <CategoryNav />
      <CategoriesFilter />
      <h2 className="text-center pt-5">
        <strong>Data for {categoryToCap[category]}</strong>
      </h2>
      <DownloadCSVFiles category={categoryToCap[category]} />
    </div>
  );
};

// Define a server component that accepts category as a parameter
export default function CategoriesPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  return (
    <DataContent
      category={
        category as
          | "community"
          | "transportation"
          | "school"
          | "employment"
          | "publicSafety"
      }
    />
  );
}
