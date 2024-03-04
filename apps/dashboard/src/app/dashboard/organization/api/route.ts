import { prisma } from '@/database'

export async function POST(req: Request) {
  const { clerkId, title } = await req.json()

  const data = await prisma.user.update({
    where: {
      clerkId
    },
    data: {
      organization: {
        create: [{ title }]
      }
    }
  })

  return Response.json(data)
}
