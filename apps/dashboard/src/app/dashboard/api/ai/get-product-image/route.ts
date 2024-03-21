import { imageModelSdk } from '@/api-utils/leonardo'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const id = query.get('id')

  if (!id) return Response.json({
    result: null,
    error: 'No id!',
    success: false
  })

  try {
    const result = await imageModelSdk.generation.getGenerationById(id)

    if (!result.object) {
      return Response.json({
        result: null,
        error: 'Could not upload image',
        success: false
      }, { status: 404 })
    }

    const url = result.object.generationsByPk?.generatedImages
    const status = result.object.generationsByPk?.status

    if (!url) {
      return Response.json({
        result: null,
        error: 'Error no imageId or url',
        success: false
      })
    }

    return Response.json({
      result: {
        url,
        status
      },
      error: null,
      success: true
    })
  } catch (error) {
    return Response.json({
      result: null,
      error,
      success: true
    })
  }
}