
export const dynamic = "force-dynamic";

import React, { Suspense } from 'react'
import TeachersManagementClient from './TeacherClient'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeachersManagementClient />
    </Suspense>
  )
}

export default Page
