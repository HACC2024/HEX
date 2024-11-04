import { Navbar, NavLink, Container } from "react-bootstrap";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import "../styles/CategoriesPage.Style.css";
import BookmarkDropdown from "./Bookmark/BookmarksDropdown";

const CategoryNav = () => (
  <Navbar className="d-flex CatNavCont">
    <Container>
      <NavLink href="../">
        <ArrowLeftCircleFill size={30} />
        <strong className="px-2">Back to Home</strong>
      </NavLink>
      <BookmarkDropdown />
    </Container>
  </Navbar>
);

export default CategoryNav;
