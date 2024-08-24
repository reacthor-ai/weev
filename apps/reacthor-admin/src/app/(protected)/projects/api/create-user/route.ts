import prisma from '@/shared-utils/client'

export async function POST(req: Request) {
  const { user, organizationTitle } = await req.json()
  let error, data

  try {
    const createOrg = await prisma.organization.create({
      data: {
        title: organizationTitle ?? ''
      }
    })

    if (createOrg) {
      error = null

      data = await prisma.user.create({
        data: {
          name: user.name,
          clerkId: user.clerkId,
          organizationId: createOrg.id
        }
      })
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
