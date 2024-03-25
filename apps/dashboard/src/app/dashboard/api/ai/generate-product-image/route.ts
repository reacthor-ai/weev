import { imageModelSdk } from '@/api-utils/leonardo'
import { modelList } from '@/api-utils/leonardo/constant'

export async function POST(req: Request) {
  const params = await req.json()

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
  } = params

  if (modelList['PhotoReal'] === id) {
    try {
      const result = await imageModelSdk.generation.createGeneration({
        initImageId: imageId ?? undefined,
        initStrength: imageId ? initStrength : undefined,
        photoReal: true,
        public: false,
        photoRealStrength,
        presetStyle,
        alchemy: true,
        modelId: null,
        expandedDomain: true,
        contrastRatio,
        numImages: 1,
        width,
        prompt,
        height
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
          }, { status: 200 })
        }
      }
    } catch (error) {
      return Response.json({
        result: null,
        error: error,
        success: false
      }, { status: 404 })
    }
  }
  return Response.json({
    result: null,
    error: 'Error your model ID could be wrong',
    success: false
  }, { status: 404 })
}