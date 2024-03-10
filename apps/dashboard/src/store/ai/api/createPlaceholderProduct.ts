type CreatePlaceholderProductParams = {
  prompt: {
    text: string
    image: string
  },
  brandVoiceId: string
  projectId: string
  src: string
  title: string
  description: string
}

export const createPlaceholderProduct = async (params: CreatePlaceholderProductParams) => {
  const response = await fetch(`/dashboard/api/create-placeholder-product`, {
    method: 'POST',
    body: JSON.stringify(params)
  })

  const url = await response.json()
  return url
}