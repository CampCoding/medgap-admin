export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import HomeClient from "./HomeClient";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
};

export default Page;
