export const dynamic = "force-dynamic";
import React from 'react'
import NotificationsPageClient from './NotificationsPageClient'
import { Suspense } from 'react';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationsPageClient />
    </Suspense>
  )
}

export default Page
