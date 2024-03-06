import { PageHeader } from '@/components/PageHeader'
import { BrandIdentityCreateDetails } from '@/lib/create-details/BrandIdentity'
import { getUser } from '@/database/user'
import { Suspense } from 'react'

export default async function DashboardCreateBrandVoice() {
  const userInfo = await getUser()

  return (
    <>
      <PageHeader
        title={'Create Brand Voice'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <Suspense fallback={'Loading...'}>
          <div className='mt-8'>
            <BrandIdentityCreateDetails
              organizationId={userInfo.organization[0].id}
              id={userInfo.id}
              clerkId={userInfo.clerkId}
            />
          </div>
        </Suspense>
      </PageHeader>
    </>
  )
}
