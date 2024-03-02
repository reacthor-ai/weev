import { PageHeader } from '@/components/PageHeader'
import { ProjectCard } from '@/components/Projects/Projects'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export default function DashboardProjects() {
  return (
    <>
      <PageHeader
        title={'Projects'}
        subTitle={'Company Projects'}
        content={'Organize your brand voices and products using projects.'}
        btnTitle='Create Projects'
        btnLink={NAVIGATION.PROJECT_DETAILS_CREATE}
      >
        <div className='mt-8'>
          <ProjectCard />
        </div>
      </PageHeader>
    </>
  )
}
