import prisma from '@/shared-utils/client'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clerkId = searchParams.get('clerkId')
  let error, data

  try {
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: {
          clerkId
        }
      })

      if (user) {
        const organization = await prisma.organization.findUnique({
          where: {
            id: user.organizationId
          },
          include: {
            projects: true
          }
        })
        data = {
          user,
          organization
        }
        error = null
      }
    } else {
      data = null
      error = null
    }
  } catch (e) {
    error = e
    data = null
  }

  return Response.json({
    error,
    data
  })
}
