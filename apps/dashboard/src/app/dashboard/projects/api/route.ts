import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()

  const { organizationId, clerkId, title, description } = params

  const data = await prisma.organization.update({
    where: {
      id: organizationId,
      user: {
        clerkId
      }
    },
    data: {
      project: {
        create: [
          {
            title,
            description
          }
        ]
      }
    }
  })

  return Response.json(data)
}
