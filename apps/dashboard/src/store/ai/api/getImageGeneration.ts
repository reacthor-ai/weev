import { WEEEV_AI_API_URL } from '@/shared-utils/constant/constant-default'

type GetUniqueGenerationByIdParams = {
  image_id: unknown
  clerkId: string
}

export const getUniqueGenerationById = async (params: GetUniqueGenerationByIdParams) => {
  const response = await fetch(`${WEEEV_AI_API_URL}/product/get-single-image/${params.image_id}`, {
    method: 'GET',
    headers: {
      'User-Id': params.clerkId,
      'Content-Type': 'application/json'
    }
  })

  const url = await response.json()
  return url
}