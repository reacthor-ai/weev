import { cache } from 'react'
import { ImageType, prisma, ProductType } from '@/database'
import { getUser } from '@/database/user'
import { bucket } from '@/api-utils/gcp/storage'
import { EXPIRY_7_DAYS } from '@/shared-utils/constant/constant-default'

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

  const getImage = async (id: string) => {
    const file = `${projects.organizationId}/${id}`
    const [url] = await bucket.file(file)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: EXPIRY_7_DAYS
      })

    return url
  }

  const fetchAndSetProducts = async (projects) => {
    return await Promise.all(projects.product.map(async (product) => {
      const images = product.image.find(i => i.default)

      if (images) {
        const res = await getImage(images.src)
        return {
          ...product,
          image: {
            ...images,
            src: res
          } as ImageType
        }
      }
      return product
    }))
  }

  const products = await fetchAndSetProducts(projects)

  return {
    products: products as unknown as ProductType[],
    details: {
      title: projects.title,
      description: projects.description
    }
  }
}
