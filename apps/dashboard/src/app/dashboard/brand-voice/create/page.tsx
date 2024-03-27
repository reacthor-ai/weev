import { PageHeader } from '@/components/PageHeader'
import { getUser } from '@/database/user'
import { Suspense } from 'react'
import { Brand } from '@/lib/create-details/Brand'

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
          <div className='min-w-full mt-8'>
            <Brand
              organizationId={userInfo.organization[0].id}
              id={userInfo.id}
              clerkId={userInfo.clerkId}
            />
          </div>
        </Suspense>
        <div className='mt-[8rem]' />
      </PageHeader>
    </>
  )
}
