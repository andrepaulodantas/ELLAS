import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Helmet } from "react-helmet";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, title = "ELLAS" }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow mt-[48px] sm:mt-[56px] md:mt-[64px]">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PageWrapper;
