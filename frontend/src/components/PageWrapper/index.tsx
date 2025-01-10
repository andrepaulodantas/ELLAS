import React from "react";
import Header from "components/Header";
import Footer from "components/Footer";
import { Helmet } from "react-helmet";

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description || ""} />
      </Helmet>
      <div className="flex flex-col items-center justify-start w-full bg-white-A700">
        <Header />
        <div className="flex flex-col items-center justify-start w-full">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PageWrapper;
