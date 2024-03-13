import { cache } from 'react'
import { prisma } from '@/database'
import { getUser } from '@/database/user'
import { getUniqueGenerationById } from '@/store/ai/api/getImageGeneration'

export const getOrganizationProjects = cache(async () => {
  const user = await getUser()

  const projects = await prisma.project.findMany({
    where: {
      organizationId: user.organization[0].id
    }
  })

  if (!projects) return null

  return projects
})

type GetUniqueProjectsParams = {
  id: string
}

export const getUniqueProjects = async (params: GetUniqueProjectsParams) => {
  const { id } = params
  const user = await getUser()

  const projects = await prisma.project.findUnique({
    where: {
      id: id,
      organization: {
        id: user.organization[0].id
      }
    },
    include: {
      product: {
        include: {
          image: true
        }
      }
    }
  })

  if (!projects) return null

  const images = projects.product.map((product) =>
    product.image.find(defaultImage => defaultImage.default)
  )

  await images.map(async image => {
    if (image) {
      const isImagePending = image.src.includes('https')
      if (!isImagePending) {
        console.log('updating images')
        const uniqueValues = await getUniqueGenerationById({
          image_id: image?.src ?? '',
          clerkId: user.clerkId
        })

        const status = uniqueValues?.message?.generations_by_pk?.status
        const url = uniqueValues?.message?.generations_by_pk?.generated_images[0]?.url

        if (status === 'COMPLETE') {
          await prisma.image.update({
            data: {
              src: url
            },
            where: { id: image?.id }
          })
        }
      }

      console.log('nope')
    }
  })

  return {
    products: projects.product,
    details: {
      title: projects.title,
      description: projects.description
    }
  }
}
