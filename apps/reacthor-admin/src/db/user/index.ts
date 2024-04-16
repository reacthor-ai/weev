import { cache } from 'react'
import { currentUser } from '@clerk/nextjs'
import { reacthorDbClient, ReacthorUser } from '@/db'
import { ReturnApi } from '@/db/types'

export const getUser = cache(async () => {
  const clerkUser = await currentUser()

  if (clerkUser) {
    const findClerkUserById = await reacthorDbClient.user.findUnique({
      where: {
        clerkId: clerkUser.id
      },
      include: {
        organization: true
      }
    })

    if (!findClerkUserById) return null

    return findClerkUserById
  }

  throw new Error('Only run this function in the [dashboard]')
})

export type CreateUserParams = {
  organizationTitle: string
}

export const createUser = async (params: CreateUserParams) => {
  const { organizationTitle } = params
  try {
    const clerkUser = await currentUser()

    if (clerkUser) {
      const user = await reacthorDbClient.user.create({
        data: {
          clerkId: clerkUser.id,
          name: ``,
          organization: {
            create: {
              title: organizationTitle
            }
          }
        },
        include: {
          organization: true
        }
      })

      return Response.json({
        success: true,
        data: user,
        error: null
      } as ReturnApi<ReacthorUser>)
    }
  } catch (error) {
    return Response.json({
      success: false,
      data: null,
      error
    } as ReturnApi<ReacthorUser>)
  }
}