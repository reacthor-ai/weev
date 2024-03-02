import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'

export default function DashboardCreateProjects() {
  return (
    <>
      <PageHeader
        title={'Create Projects'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <div className='mt-8'>
          <CreateDetails create={'projects'} />
        </div>
      </PageHeader>
    </>
  )
}
