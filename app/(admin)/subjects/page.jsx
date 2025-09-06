export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SubjectsManagementClient from "./SubjectsManagementClient";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubjectsManagementClient />
    </Suspense>
  );
};

export default Page;
