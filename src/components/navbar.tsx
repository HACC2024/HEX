import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;