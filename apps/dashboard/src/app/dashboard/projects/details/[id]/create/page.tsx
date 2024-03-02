import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'

export default function DashboardCreateProducts() {
  return (
    <>
      <PageHeader
        title={'Create Products'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <div className='mt-8'>
          <CreateDetails create={'product'} />
        </div>
      </PageHeader>
    </>
  )
}
