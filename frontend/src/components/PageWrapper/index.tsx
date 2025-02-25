import React from "react";
import Header from "../Header";
import { Helmet } from "react-helmet";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title = "ELLAS",
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">{children}</div>
      </div>
    </>
  );
};

export default PageWrapper;
