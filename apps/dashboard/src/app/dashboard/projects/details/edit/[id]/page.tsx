import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export default function DashboardEditProducts() {
  return (
    <>
      <PageHeader
        title={'Wide Leg Cargo Jeans - Blue'}
        subTitle={''}
        content={''}
        btnTitle={'Add Image'}
        btnLink={NAVIGATION.PROJECT_DETAILS_CREATE_IMAGE}
        enableBackBtn
      >
        <div className='mt-8 overflow-auto pb-12 h-screen'>
          <CreateDetails create={'edit-product'} />
        </div>
      </PageHeader>
    </>
  )
}
