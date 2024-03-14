import { PageHeader } from '@/components/PageHeader'
import { CreateImageDetails } from '@/lib/create-details/Product/CreateImage'

export default function DashboardCreateImage() {
  return (
    <>
      <PageHeader
        title={'Create Image'}
        subTitle={''}
        content={''}
        btnTitle={'Save Image'}
        btnLink={'save-now'}
        enableBackBtn
      >
        <div className="mt-8 pb-12 h-screen">
          <CreateImageDetails />
        </div>
      </PageHeader>
    </>
  )
}
