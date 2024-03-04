import { PageHeader } from '@/components/PageHeader'
import { ProjectCreateDetails } from '@/lib/create-details/Projects'
import { getUser } from '@/database/user'

export default async function DashboardCreateProjects() {
  const user = await getUser()
  return (
    <>
      <PageHeader
        title={'Create Projects'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <div className='mt-8'>
          <ProjectCreateDetails
            organizationId={user.organization[0].id}
            clerkId={user.clerkId}
          />
        </div>
      </PageHeader>
    </>
  )
}
