// src/app/layout.tsx
import React from "react";

export const metadata = {
  title: "Hex Opendata App",
  description: "An open data app built with Next.js",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
    <body>
      {children}
    </body>
    </html>
  );
};

export default RootLayout;
