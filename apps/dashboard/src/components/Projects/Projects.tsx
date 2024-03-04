import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { ProjectType } from '@/database'

type ProjectCardProps = {
  projects: ProjectType[]
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { projects } = props
  return (
    <div className='grid grid-cols-3 gap-6'>
      {projects.map(project => {
        return (
          <Link href={`${NAVIGATION.PROJECT_DETAILS}/${project?.id}`}>
            <Card className='w-[360px] bg-white p-3 rounded-lg'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>
                  {project?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='mt-2'>
                <CardDescription className='text-sm text-gray-600'>
                  {project?.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
