import { PageHeader } from '@/components/PageHeader'
import { ProductCreateDetails } from '@/lib/create-details/Product'
import { getUser } from '@/database/user'
import { Suspense } from 'react'
import { getBrandVoicesByOrgId } from '@/database/brand'
import { redirect } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export default async function DashboardCreateProducts(props) {
  console.log({ params: props.params.id })
  const user = await getUser()

  const brandVoices = await getBrandVoicesByOrgId()

  if (!brandVoices) {
    redirect(NAVIGATION.BRAND_VOICE_CREATE)
  }

  return (
    <>
      <PageHeader
        title={'Create Products'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <Suspense fallback={'Loading...'}>
          <div className={''}>
            <ProductCreateDetails
              organizationId={user.organization[0].id}
              userId={user.id}
              clerkId={user.clerkId}
              brandVoices={brandVoices}
              projectId={props.params.id}
            />
          </div>
        </Suspense>
      </PageHeader>
    </>
  )
}
