import prisma from '@/shared-utils/client'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const projectId = searchParams.get('projectId')
  let error, data

  try {
    if (projectId) {
      const projects = await prisma.promptManagement.findMany({
        where: {
          projectId
        }
      })

      data = projects
      error = null
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
