import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Introduction from "../components/introduction";
import Category from "../components/category";
import HowItWorks from "../components/howItWorks";
import "../styles/styles.css";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div id="introduction">
        <Introduction />
      </div>
      <div id="category">
        <Category />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
