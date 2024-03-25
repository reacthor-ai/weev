import { NextRequest } from 'next/server'
import { bucket } from '@/api-utils/gcp/storage'
import { GenerateSignedPostPolicyV4Options } from '@google-cloud/storage'
import { EXPIRY_15_MINUTES, EXPIRY_7_DAYS } from '@/shared-utils/constant/constant-default'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams

  const fileName = query.get('fileName')
  const type = query.get('type')
  const expires_seven_days = query.get('expires_seven_days')

  if (!fileName) {
    return Response.json({
      success: false,
      error: 'Please add a file query'
    }, { status: 404 })
  }

  const options: GenerateSignedPostPolicyV4Options = {
    expires: EXPIRY_15_MINUTES,
    fields: {
      'x-goog-meta-test': 'data'
    }
  }

  if (type === 'upload') {
    const file = bucket.file(fileName)

    const [response] = await file.generateSignedPostPolicyV4(options)

    return Response.json({
      success: true,
      error: null,
      response
    }, { status: 200 })
  } else if (type === 'read') {
    const [url] = await bucket.file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: expires_seven_days ? EXPIRY_7_DAYS : EXPIRY_15_MINUTES
      })

    return Response.json({
      success: true,
      error: null,
      response: url
    }, { status: 200 })
  }

}