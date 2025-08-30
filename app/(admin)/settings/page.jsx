export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SystemSettingsClient from "./SettingsClient";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SystemSettingsClient />
    </Suspense>
  );
};

export default Page;
