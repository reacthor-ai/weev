import { imageModelSdk } from '@/api-utils/leonardo'

export async function GET() {
  const result = await imageModelSdk.initImage.uploadInitImage({
    extension: 'png'
  })

  if (!result.object) {
    return Response.json({
      result: null,
      error: 'Could not upload image',
      success: false
    }, { status: 404 })
  }

  const url = result.object.uploadInitImage?.url
  const imageId = result.object.uploadInitImage?.id

  if (!url || !imageId) {
    return Response.json({
      result: null,
      error: 'Error no imageId or url',
      success: false
    })
  }

  return Response.json({
    result: result.object.uploadInitImage,
    error: null,
    success: true
  })
}