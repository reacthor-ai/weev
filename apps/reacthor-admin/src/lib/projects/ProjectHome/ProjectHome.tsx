'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import { updateClerkIdAtom, useGetUserAtom } from '@/store/user/get'
import { useEffect, useState } from 'react'
import { CreateOrganization } from '@/lib/organization/CreateOrganization'
import reacthorSvg from '../../../../public/reacthor.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useCreateProjectAtom } from '@/store/project/create'

export const ProjectHome = () => {
  const clerkSession = useUser()
  const userId = clerkSession.user?.id
  const [{ isPending, data }] = useGetUserAtom()
  const router = useRouter()
  const [_, updateClerkId] = updateClerkIdAtom()
  const [{ mutate: createProject, isPending: isCreateProjectLoader }] =
    useCreateProjectAtom()
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    if (userId) {
      updateClerkId(userId)
    }
  }, [userId, data])

  if (isPending) return <>Loading...</>

  if (data && data.result.data === null) {
    return <CreateOrganization />
  }
  const projects = data?.result.data?.organization.projects ?? []
  return (
    <div className="flex min-h-screen bg-[#17171c] text-white">
      <aside className="w-1/6 bg-[#17171c] overflow-y-auto p-4 border-r border-gray-800">
        <div className="flex items-center mb-8">
          <Image
            alt="reacthor-logo"
            height={40}
            className="block m-auto"
            width={40}
            style={{
              aspectRatio: '100/100',
              objectFit: 'cover'
            }}
            src={reacthorSvg}
          />
        </div>
        <nav>
          <h2 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Projects
          </h2>
          <ul className="mb-8 space-y-2">
            <li>
              <a
                href="#"
                className="block py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                All projects
              </a>
            </li>
          </ul>
          <h2 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Workspaces
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                {data?.result.data?.organization?.title}'s workspace
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4">
          {data?.result.data?.user.name}'s account
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex space-x-4">
            <Dialog>
              <DialogTrigger>Create Project +</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <br />
                  <DialogDescription>
                    <div>
                      <Input
                        placeholder="Please enter your project name"
                        onChange={e => setProjectName(e.target.value)}
                      />
                    </div>
                    <br />
                    <Button
                      disabled={projectName.length === 0}
                      onClick={() => {
                        return createProject(
                          {
                            title: projectName,
                            organizationId:
                              data?.result.data?.organization.id ?? ''
                          },
                          {
                            onSettled: () => {
                              return window.location.reload()
                            }
                          }
                        )
                      }}
                      className="bg-white text-black hover:bg-black hover:text-white"
                    >
                      {isCreateProjectLoader ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Create Project
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            {data?.result.data?.organization.title}'s workspace
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!!projects.length ? (
              <>
                {projects.map(project => {
                  return (
                    <Card
                      onClick={() => {
                        return router.push(
                          NAVIGATION.DASHBOARD_PROJECT.WORKFLOW.HOME.replace(
                            '{projectId}',
                            project.id
                          )
                        )
                      }}
                      className="cursor-pointer"
                      key={project.id}
                    >
                      <CardContent>
                        <h3 className="my-4 text-xl font-semibold">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400">{project.id}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            ) : (
              <p>No projects yet</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
