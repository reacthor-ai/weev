import { PageHeader } from '@/components/PageHeader'
import { getUser } from '@/database/user'
import { Suspense } from 'react'
import { getBrandVoicesByOrgId } from '@/database/brand'
import { redirect } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { ProductContent } from '@/lib/create-details/Product/EditProducts/ProductContent'
import { ProductImage } from '@/lib/create-details/Product/EditProducts/ProductImage'

export default async function DashboardCreateProducts(props) {
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
            <ProductContent
              organizationId={user.organization[0].id}
              userId={user.id}
              clerkId={user.clerkId}
              projectId={props.params.id}
              brandVoices={brandVoices}
            />

            <div className='mt-[8rem]' />

            <ProductImage
              organizationId={user.organization[0].id}
              userId={user.id}
              clerkId={user.clerkId}
              projectId={props.params.id}
            />

            <div className='mt-[8rem]' />
          </div>
        </Suspense>
      </PageHeader>
    </>
  )
}
