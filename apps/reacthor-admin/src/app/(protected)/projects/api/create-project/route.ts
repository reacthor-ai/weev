import prisma from '@/shared-utils/client'

export async function POST(req: Request) {
  const { title, organizationId } = await req.json()
  let error, data

  try {
    const createProject = await prisma.project.create({
      data: {
        title,
        organizationId
      }
    })
    if (createProject) {
      error = null
      data = createProject
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
