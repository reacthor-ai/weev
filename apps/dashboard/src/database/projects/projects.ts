import { cache } from 'react'
import { prisma } from '@/database'
import { getUser } from '@/database/user'

export const getOrganizationProjects = cache(async () => {
  const user = await getUser()

  const organization = await prisma.organization.findUnique({
    where: {
      id: user.organization[0].id,
      user: {
        clerkId: user.clerkId
      }
    },
    include: {
      project: true
    }
  })

  if (!organization) return null

  return organization.project
})
