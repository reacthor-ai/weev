import { updateProductWithImage } from '@/database/products/products'

export async function POST(req: Request) {
  const {
    productId,
    projectId,
    imageSettingsPrompt,
    generalInputImage,
    imagePrompt,
    src
  } = await req.json()

  let error, success, result

  try {
    const updateProductImages = await updateProductWithImage({
      productId,
      projectId,
      imageSettingsPrompt,
      generalInputImage,
      imagePrompt,
      src
    })

    error = null
    success = true
    result = updateProductImages
  } catch (err) {
    error = err
    success = false
    result = null
  }

  return Response.json({
    error,
    success,
    result
  })
}