export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import NewExamClient from "./NewExamClient";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NewExamClient />
      </Suspense>
    </div>
  );
};

export default page;
