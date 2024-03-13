import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()

  const {
    productId,
    src
  } = params

  const data = await prisma.image.create({
    data: {
      productId,
      src,
      default: false,
      type: 'PROMPT_IMAGE'
    }
  })

  return Response.json(data)
}
