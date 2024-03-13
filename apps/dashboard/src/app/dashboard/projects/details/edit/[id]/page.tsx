import { PageHeader } from '@/components/PageHeader'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { getUser } from '@/database/user'
import { getBrandVoicesByOrgId } from '@/database/brand'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { EditProducts } from '@/lib/create-details/Product/EditProducts'
import { getProductById } from '@/database/products/products'

export default async function DashboardEditProducts(props) {
  const user = await getUser()

  const brandVoices = await getBrandVoicesByOrgId()

  const product = await getProductById({
    productId: props.params.id,
    organizationId: user.organization[0].id
  })

  if (!product) {
    notFound()
  }

  if (!brandVoices) {
    redirect(NAVIGATION.BRAND_VOICE_CREATE)
  }

  return (
    <>
      <PageHeader
        title={product.title ?? ''}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <Suspense fallback={'Loading...'}>
          <div className='mt-8 overflow-auto pb-12 h-screen'>
            <EditProducts
              brandVoices={brandVoices}
              clerkId={user.clerkId}
              organizationId={user.organization[0].id}
              userId={user.id}
              product={product}
            />
          </div>
        </Suspense>
      </PageHeader>
    </>
  )
}

