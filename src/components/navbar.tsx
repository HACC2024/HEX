import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="#Introduction">Introduction</Link>
        </li>
        <li>
          <Link href="#CatDiv">Category</Link>
        </li>
        <li>
          <Link href="#HowItWorks">How It Works</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
