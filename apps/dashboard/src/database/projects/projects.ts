import { cache } from 'react'
import { prisma } from '@/database'
import { getUser } from '@/database/user'

export const getOrganizationProjects = cache(async () => {
  const user = await getUser()

  const projects = await prisma.project.findMany({
    where: {
      organizationId: user.organization[0].id
    }
  })

  if (!projects) return null

  return projects
})

type GetUniqueProjectsParams = {
  id: string
}

export const getUniqueProjects = cache(async (params: GetUniqueProjectsParams) => {
  const { id } = params
  const user = await getUser()

  const projects = await prisma.project.findUnique({
    where: {
      id: id,
      organization: {
        id: user.organization[0].id
      }
    },
    include: {
      product: true
    }
  })

  if (!projects) return null

  return {
    products: projects.product,
    details: {
      title: projects.title,
      description: projects.description
    }
  }
})
