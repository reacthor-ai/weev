import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'

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
        <div className='mt-8 pb-12 h-screen'>
          <CreateDetails create={'create-image'} />
        </div>
      </PageHeader>
    </>
  )
}
