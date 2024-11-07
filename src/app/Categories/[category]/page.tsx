// File: pages/[category]/index.tsx

import "bootstrap/dist/css/bootstrap.min.css";
import CategoriesContent from "../../../components/CategoriesContent"; // Import the client-side component

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

const CategoriesPage = ({
  params,
}: {
  params: { category: string };
}) => {
  const { category } = params;

  return (
    <CategoriesContent
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
};

export default CategoriesPage;
