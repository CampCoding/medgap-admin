export const dynamic = "force-dynamic";
import { Suspense } from "react";
import TopicsManagementClient from "../../../components/Topics/TopicsManagementClient";

export default function TopicsPage() {

  return(
    <Suspense fallback={<div>Loading...</div>}>
      <TopicsManagementClient />
    </Suspense>
  )
}
