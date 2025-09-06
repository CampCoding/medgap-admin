
export const dynamic = "force-dynamic";
import React, { Suspense } from 'react'
import ReviewersManagementClient from './ReviewersManagementClient'

const ReviewersPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewersManagementClient />
    </Suspense>
  )
}

export default ReviewersPage
