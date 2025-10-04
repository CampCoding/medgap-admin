export const dynamic = "force-dynamic"; // 👈 الحل السحري
import React from "react";
import ExamManagerClint from "./ExamsPageClient";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamManagerClint />
    </Suspense>
  );
};

export default Page;
