import { WEEEV_AI_API_URL } from '@/shared-utils/constant/constant-default'

type UniqueVoiceParams = {
  url: string
  prompt: string
  clerkId: string
  max_token?: number
}

const TOKEN_LIMIT = 500

export const uniqueVoiceByAI = async (params: UniqueVoiceParams) => {
  const { max_token = TOKEN_LIMIT, url, prompt, clerkId } = params

  const body = {
    url,
    prompt,
    max_token
  }

  const response = await fetch(`${WEEEV_AI_API_URL}/brand-voice/store-unique-brand-voice`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'User-Id': clerkId
    }
  })

  const personalAIBrandVoice = await response.json()

  return personalAIBrandVoice
}