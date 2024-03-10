type GetBrandVoiceDocsGCPParams = {
  brandVoiceId: string
}

export const getBrandVoiceDocsGCP = async (params: GetBrandVoiceDocsGCPParams) => {
  const { brandVoiceId } = params
  const response = await fetch(`/dashboard/api/get-brand-voice-by-id/${brandVoiceId}` as string, {
    method: 'GET'
  })

  const url = await response.json()
  return url
}