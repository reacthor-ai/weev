import prisma from '@/shared-utils/client'

export async function POST(req: Request) {
  const { title, projectId } = await req.json()
  let error, data

  try {
    const createPrompt = await prisma.promptManagement.create({
      data: {
        title,
        projectId
      }
    })
    if (createPrompt) {
      error = null
      data = createPrompt
    } else {
      error = null
      data = null
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
