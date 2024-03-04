import { prisma } from '@/database'
import { currentUser } from '@clerk/nextjs'
import { cache } from 'react'

export const getUser = cache(async () => {
  const clerkUser = await currentUser()

  if (clerkUser) {
    const findClerkUserById = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id
      },
      include: {
        organization: true
      }
    })

    if (!findClerkUserById) {
      const user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`
        },
        include: {
          organization: true
        }
      })

      return user
    }
    return findClerkUserById
  }

  throw new Error('Only run this function in the [dashboard]')
})
