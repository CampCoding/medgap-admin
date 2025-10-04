import React from "react";

const PagesHeader = ({ title, subtitle , extra }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-4xl font-bold text-[#202938] mb-2">
          {title ?? "Modules Management"}
        </h1>
        <p className="text-[#202938]/60 text-lg">
          {subtitle ?? "Organize and manage your teaching modules"}
        </p>
      </div>
      {extra}
    </div>
  );
};

export default PagesHeader;
