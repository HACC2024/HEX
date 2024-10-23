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
          <Link href="#introduction">Introduction</Link>
        </li>
        <li>
          <Link href="#category">Category</Link>
        </li>
        <li>
          <Link href="#how-it-works">How It Works</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;