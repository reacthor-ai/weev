import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'
import { NextPageContext } from 'next'

export default function DashboardCreateProducts(params: NextPageContext) {
  return (
    <>
      <PageHeader
        title={'Create Products'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <div className={''}>
          <CreateDetails create={'product'} />
        </div>
      </PageHeader>
    </>
  )
}
