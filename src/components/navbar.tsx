import React from "react";
import Link from "next/link";
import "../styles/styles.css";

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="#introduction">Introduction</Link>
        </li>
        <li>
          <Link href="#category">Category</Link>
        </li>
        <li>
          <Link href="#how-it-works">How It Works</Link>
        </li>
        <li>
          <Link href="/test">Test AI</Link>
        </li>
        <li>
          <Link href="/Admin">Admin Portal</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
