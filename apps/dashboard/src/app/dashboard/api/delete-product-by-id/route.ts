import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()
  const { productId } = params

  const data = await prisma.product.delete({
    where: {
      id: productId
    }
  })

  if (data) {
    return Response.json({ success: true })
  }
  return Response.json({ success: false })
}
