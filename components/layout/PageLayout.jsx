import React from "react";

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
};

export default PageLayout;
