import { type UploadMessagesToJsonAndUseParams, uploadMessagesToJsonlAndUse } from '@/clients/openai'

export async function POST(req: Request) {
  const params: UploadMessagesToJsonAndUseParams = await req.json()
  return await uploadMessagesToJsonlAndUse(params)
}
