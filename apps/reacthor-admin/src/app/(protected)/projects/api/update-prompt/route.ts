import prisma from '@/shared-utils/client'

export async function POST(req: Request) {
  const {
    data: { template, title, projectId },
    promptId
  } = await req.json()
  let error, data

  try {
    const updatePrompt = await prisma.promptManagement.update({
      where: {
        id: promptId,
        projectId
      },
      data: {
        title,
        template
      }
    })
    if (updatePrompt) {
      error = null
      data = updatePrompt
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
