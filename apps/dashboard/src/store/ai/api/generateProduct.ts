import { WEEEV_AI_API_URL } from '@/shared-utils/constant/constant-default'

export type UniqueVoiceParams = {
  model_id: 'PhotoReal' | 'OtherModel'
  brand_voice: string
  marketing_requirements: string
  clerkId: string
  image: {
    prompt: string
    url: string
  }
}

export const generateProductWithAI = async (params: UniqueVoiceParams) => {
  const { clerkId, model_id, marketing_requirements, brand_voice } = params

  const images = [
    {
      prompt: params.image.prompt,
      url: params.image.url
    }
  ]

  const response = await fetch(`${WEEEV_AI_API_URL}/products/generate`, {
    method: 'POST',
    body: JSON.stringify({
      model_id,
      marketing_requirements,
      brand_voice,
      images
    }),
    headers: {
      'User-Id': clerkId,
      'Content-Type': 'application/json'
    }
  })

  const genProductWithAI = await response.json()

  return genProductWithAI
}