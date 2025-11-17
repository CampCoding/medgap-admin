import React, { Suspense } from "react";
import SubscriptionCardsClient from "./SubscriptionCardsClient";

export const dynamic = "force-dynamic";

const SubscriptionCardsPage = () => {
  return (
    <Suspense fallback={<div>Loading subscription cards...</div>}>
      <SubscriptionCardsClient />
    </Suspense>
  );
};

export default SubscriptionCardsPage;

