import { gcpStorage } from '@/shared-utils/constant/storage'
import { getBrandVoiceById } from '@/database/brand/brand'

export async function GET(
  req: Request,
  { params }: { params: { brandVoiceId: string } }
) {
  const { brandVoiceId } = params
  let document, error

  const bucket = gcpStorage.bucket(process.env.BUCKET_NAME as string)

  try {

    const brandVoice = await getBrandVoiceById({
      id: brandVoiceId
    })

    if (brandVoice) {
      const fileName = `${brandVoice.organizationId}/${brandVoice.link}.txt`

      const [bucketResponse] = await bucket.file(fileName).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      })
      document = bucketResponse
    }

  } catch (err) {
    document = null
    error = err
  }

  return Response.json({
    document,
    error
  })
}