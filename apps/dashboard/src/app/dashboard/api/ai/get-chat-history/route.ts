import { NextRequest } from 'next/server'
import { prisma } from '@/database'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const id = query.get('id')

  try {
    const chat = await prisma.$queryRaw`SELECT type, content
                                        FROM chat_voice
                                        WHERE session_id = ${id}`

    return Response.json({
      response: chat,
      error: null,
      success: true
    })
  } catch (error) {
    return Response.json({
      response: null,
      error,
      success: false
    })
  }
}