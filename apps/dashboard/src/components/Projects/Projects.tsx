import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

const demo = [
  {
    id: '821e4bb1-dabf-4595-82d5-dcee4e1677a5',
    title: 'March Catalogue',
    content: 'Enhance user experience by incorporating user feedback and conducting A/B testing to ensure optimal performance.',
    date: '20/03/2024',
    avatar: 'DC'
  }, {
    id: '821e4bb1-dabf-4595-82d5-dcee4e1677a5',
    title: 'March Catalogue',
    content: 'Enhance user experience by incorporating user feedback and conducting A/B testing to ensure optimal performance.',
    date: '20/03/2024',
    avatar: 'DC'
  }, {
    id: '821e4bb1-dabf-4595-82d5-dcee4e1677a5',
    title: 'March Catalogue',
    content: 'Enhance user experience by incorporating user feedback and conducting A/B testing to ensure optimal performance.',
    date: '20/03/2024',
    avatar: 'DC'
  }, {
    id: '821e4bb1-dabf-4595-82d5-dcee4e1677a5',
    title: 'March Catalogue',
    content: 'Enhance user experience by incorporating user feedback and conducting A/B testing to ensure optimal performance.',
    date: '20/03/2024',
    avatar: 'DC'
  }
]

export const ProjectCard = () => {
  return (
    <div className='grid grid-cols-3 gap-6'>
      {
        demo.map(project => {
          return (
            <Link href={`${NAVIGATION.PROJECT_DETAILS}/${project.id}`}>
              <Card className='w-[360px] bg-white p-3 rounded-lg'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className='mt-2'>
                  <CardDescription className='text-sm text-gray-600'>
                    {project.content}
                  </CardDescription>
                  <div className='flex items-center mt-4 space-x-2'>
                    <Avatar>
                      <AvatarImage alt={project.avatar} src={project.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className='text-xs font-medium text-gray-500'>Date: {project.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })
      }
    </div>
  )
}
