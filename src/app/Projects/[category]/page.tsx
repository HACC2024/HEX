import "bootstrap/dist/css/bootstrap.min.css";
import ProjectContent from "../../../components/ProjectContent"; 

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

const ProjectsPage = ({
  params,
}: {
  params: { category: string };
}) => {
  const { category } = params;

  return (
    <ProjectContent
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

export default ProjectsPage;
