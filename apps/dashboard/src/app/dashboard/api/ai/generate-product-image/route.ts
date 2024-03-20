import { imageModelSdk } from '@/api-utils/leonardo'
import { modelList } from '@/api-utils/leonardo/constant'

export async function POST(req: Request) {
  const {
    imageId,
    model: { id },
    options: {
      photoRealStrength,
      presetStyle,
      contrastRatio,
      height,
      width,
      prompt,
      initStrength
    }
  } = await req.json()

  const model = modelList[id]

  if (modelList['PhotoReal'] === model) {
    try {
      const result = await imageModelSdk.generation.createGeneration({
        initImageId: imageId,
        photoReal: true,
        photoRealStrength,
        presetStyle,
        alchemy: true,
        expandedDomain: true,
        contrastRatio,
        initStrength,
        width,
        height,
        prompt
      })

      if (result.object && result.object.sdGenerationJob) {
        const genId = result.object.sdGenerationJob.generationId

        /**
         * We use this to init the webhook.
         */
        if (genId) {
          return Response.json({
            result: genId,
            error: null,
            success: true
          })
        }
      }
    } catch (error) {
      return Response.json({
        result: null,
        error: error,
        success: true
      })
    }
  }

  return Response.json({
    result: null,
    error: null,
    success: true
  })
}