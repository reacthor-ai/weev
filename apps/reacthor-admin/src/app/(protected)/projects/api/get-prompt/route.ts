import prisma from '@/shared-utils/client'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const promptId = searchParams.get('promptId')
  let error, data

  try {
    if (promptId) {
      const prompt = await prisma.promptManagement.findUnique({
        where: {
          id: promptId
        }
      })
      data = prompt
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
