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

type CreateProductParams = {
  prompt: {
    text: string
  }

  brandVoiceId: string
  projectId: string
  title: string
  description: string
}

export const createProduct = async (params: CreateProductParams) => {
  const {
    prompt: { text },
    description,
    projectId,
    brandVoiceId,
    title
  } = params

  return await prisma.product.create({
    data: {
      title,
      description,
      projectId,
      brandVoiceId,
      status: 'IN_PROGRESS',
      prompt: {
        createMany: {
          data: [
            {
              text, // text prompt
              type: 'PRODUCT_TEXT'
            }
          ]
        }
      }
    },
    include: {
      brandVoice: false
    }
  })
}

type UpdateProductWithImage = {
  productId: string
  projectId: string
  initialImage: string
  imagePrompt: string
  src: string
}

export const updateProductWithImage = async (params: UpdateProductWithImage) => {
  const { productId, projectId, initialImage, imagePrompt, src } = params

  return await prisma.product.update({
    where: {
      id: productId,
      projectId
    },
    data: {
      status: 'DONE',
      prompt: {
        createMany: {
          data: [
            {
              text: initialImage,
              type: 'PRODUCT_IMAGE'
            },
            {
              text: imagePrompt,
              type: 'PRODUCT_TEXT'
            }
          ]
        }
      },
      image: {
        create: {
          default: true,
          src,
          type: 'GENERAL_IMAGE'
        }
      }
    }
  })
}