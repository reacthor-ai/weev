import { prisma } from '@/database'

type GetProductId = {
  productId: string
  organizationId: string
}

export const getProductById = async (params: GetProductId) => {
  const { productId, organizationId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      project: {
        organizationId
      }
    },
    include: {
      image: true,
      prompt: true,
      brandVoice: true
    }
  })

  if (!product) return null

  return product
}