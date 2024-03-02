import { PageHeader } from '@/components/PageHeader'
import { BrandIdentity } from '@/components/BrandIdentity'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export default function DashboardBrandVoice() {
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
          <BrandIdentity />
        </div>
      </PageHeader>
    </>
  )
}
