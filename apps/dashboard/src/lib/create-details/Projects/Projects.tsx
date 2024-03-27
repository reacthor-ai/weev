'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateProjectsAtom } from '@/store/projects/createProjects'

type ProjectCreateDetailsProps = {
  clerkId: string
  organizationId: string
}

export const ProjectCreateDetails = (props: ProjectCreateDetailsProps) => {
  const { clerkId, organizationId } = props

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [{ mutate: mutateProjects, isPending }] = useCreateProjectsAtom()
  const router = useRouter()

  const isDisabled = title.length === 0 || description.length === 0

  const createProjects = async () => {
    await mutateProjects(
      {
        clerkId,
        organizationId,
        project: {
          title,
          description
        }
      },
      {
        onSettled: () => {
          router.back()
        }
      }
    )
  }

  return (
    <div className='w-[50%] p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden h-full'>
        <div className='grid grid-cols-1'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>Product descriptions</h1>
            <div className='space-y-4'>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700'
                  htmlFor='product-name'
                >
                  Project Name *
                </label>
                <Input
                  onChange={e => setTitle(e.target.value)}
                  placeholder='Please enter the title of your project'
                />
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700'
                  htmlFor='product-attributes'
                >
                  Project Description *
                </label>
                <Textarea
                  onChange={e => setDescription(e.target.value)}
                  placeholder='What is your project about?'
                />
              </div>
            </div>
            <Button
              disabled={isDisabled || isPending}
              onClick={createProjects}
              className='bg-blue-600 text-white w-full'
            >
              {isPending ? 'Creating a project please wait...' : 'Create projects'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
