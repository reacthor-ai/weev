import { ProjectCard } from '@/components/Projects/Projects'
import { getOrganizationProjects } from '@/database/projects'
import { PageHeader } from '@/components/PageHeader'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { Suspense } from 'react'

export default async function DashboardProjects() {
  const projects = await getOrganizationProjects()

  return (
    <PageHeader
      title={'Projects'}
      subTitle={'Company Projects'}
      content={'Organize your brand voices and products using projects.'}
      btnTitle='Create Projects'
      btnLink={NAVIGATION.PROJECT_DETAILS_CREATE}
    >
      <Suspense fallback={'Loading...'}>
        {!projects || projects.length === 0 ? (
          <>Not found!</>
        ) : (
          <ProjectCard projects={projects} />
        )}
      </Suspense>
    </PageHeader>
  )
}
