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
    prompt: string
  }

  brandVoiceId: string
  projectId: string
  title: string
  description: string
}

export const createProduct = async (params: CreateProductParams) => {
  const {
    prompt: { text, prompt },
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
              type: 'PRODUCT_TEXT',
              prompt
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
  imageSettingsPrompt: PromptImageType[]
  generalInputImage?: string
  imagePrompt: string
  src: string
}

type PromptImageType = {
  text: string
  type: 'PRODUCT_IMAGE'
  prompt: string
}

export const updateProductWithImage = async (params: UpdateProductWithImage) => {
  const { productId, projectId, generalInputImage, imageSettingsPrompt, imagePrompt, src } = params

  const imagePrompts: PromptImageType[] = imageSettingsPrompt.map(va => ({
    text: va.text,
    type: 'PRODUCT_IMAGE',
    prompt: `Settings for prompt: ${imagePrompt}`
  }))

  const promptInputImage: PromptImageType[] = [
    {
      text: src,
      type: 'PRODUCT_IMAGE',
      prompt: imagePrompt
    },
    {
      prompt: 'Prompt input image',
      text: generalInputImage ?? 'No input image',
      type: 'PRODUCT_IMAGE'
    }
  ]

  return await prisma.product.update({
    where: {
      id: productId,
      projectId
    },
    data: {
      status: 'DONE',
      image: {
        create: {
          default: true,
          src,
          type: 'GENERAL_IMAGE',
          prompt: {
            createMany: {
              data: [...imagePrompts, ...promptInputImage]
            }
          }
        }
      }
    }
  })
}

type UpdateProductParams = {
  prompt: {
    text: string
    prompt: string
  }

  productId: string
  projectId: string
  brandVoiceId: string
  title: string
  description: string
}

export const updateProduct = async (params: UpdateProductParams) => {
  const {
    productId,
    projectId,
    prompt: {
      text,
      prompt
    },
    title,
    description,
    brandVoiceId
  } = params

  return await prisma.product.update({
    where: {
      id: productId,
      projectId
    },

    data: {
      title,
      description,
      brandVoiceId,
      status: 'DONE',
      prompt: {
        createMany: {
          data: [
            {
              prompt,
              text, // text prompt
              type: 'PRODUCT_TEXT'
            }
          ]
        }
      }
    }
  })
}