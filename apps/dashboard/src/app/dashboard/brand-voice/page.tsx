import { PageHeader } from '@/components/PageHeader'
import { BrandIdentity } from '@/components/BrandIdentity'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { getBrandVoicesByOrgId } from '@/database/brand'
import { Suspense } from 'react'

export default async function DashboardBrandVoice() {
  const brandVoices = await getBrandVoicesByOrgId()

  return (
    <>
      <PageHeader
        title={'Brand Identities'}
        subTitle={'Your companies brand identity'}
        content={'Think of your brand identity as your personal copywriter that understands how to standardize your product creation'}
        btnTitle='Add Brand'
        btnLink={NAVIGATION.BRAND_VOICE_CREATE}
      >

        <div className='mt-8'>
          <Suspense fallback={'Loading...'}>
            {!brandVoices || brandVoices.length === 0 ? (
              <>Please add your brand voices!</>
            ) : (
              <BrandIdentity brandVoices={brandVoices} />
            )}
          </Suspense>
        </div>
      </PageHeader>
    </>
  )
}
