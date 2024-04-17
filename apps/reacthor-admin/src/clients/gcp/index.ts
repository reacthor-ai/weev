import type { GenerateSignedPostPolicyV4Options } from '@google-cloud/storage'
import { Storage } from '@google-cloud/storage'
import {
  createBucketStoreTransactionMessaging,
  CreateBucketStoreTransactionMessagingParams,
  PickTransactionMessaging
} from '@/db/bucket'
import { STORAGE_PREFIX } from '@/shared-utils/constant/prefix'
import csv from 'csv-parser'
import { MessagingRoleValue } from '@/db'

const EXPIRY_15_MINUTES = Date.now() + 15 * 60 * 1000

export const gcpStorage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY
  }
})

export const bucket = gcpStorage.bucket(process.env.BUCKET_NAME as string)

type UploadFileParams = {
  files?: Array<{ fullPath: string; fineTunePath: string }>
}

export const uploadManyFiles = async (params: UploadFileParams) => {
  const { files } = params

  if (!files) {
    return Response.json(
      {
        success: false,
        error: 'Please add a file'
      },
      { status: 404 }
    )
  }

  const options: GenerateSignedPostPolicyV4Options = {
    expires: EXPIRY_15_MINUTES,
    fields: {
      'x-goog-meta-test': 'data'
    }
  }

  const urlResult = await Promise.all(
    files.map(async fileName => {
      try {
        const file = bucket.file(fileName.fullPath)

        const [response] = await file.generateSignedPostPolicyV4(options)
        return response
      } catch (error) {
        return Response.json(
          {
            success: false,
            error
          },
          { status: 404 }
        )
      }
    })
  )

  if (urlResult.every(result => result !== null)) {
    return Response.json(
      {
        success: true,
        error: null,
        result: urlResult
      },
      { status: 200 }
    )
  } else {
    return Response.json(
      {
        success: false,
        error: 'Some files failed to generate signed URLs.'
      },
      { status: 404 }
    )
  }
}

export const mergeCSVFiles = async (params: PickTransactionMessaging) => {
  const { bucketStoreData, masterBucketId, datastoreId, organizationId } =
    params

  const folderPath = `${STORAGE_PREFIX.organization.home(
    organizationId
  )}/${STORAGE_PREFIX.organization.line.fine_tune.sparse_fine_tune_home(masterBucketId)}`

  try {
    const [files] = await bucket.getFiles({ prefix: folderPath })

    let allRows: Array<{
      role: MessagingRoleValue
      content: string
      datastoreId: string
    }> = []

    for (const file of files.filter(f => f.name.endsWith('.csv'))) {
      const stream = file.createReadStream();

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim()
          }))
          .on('data', (row) => {
            if (row['Account name'] === 'User' || row['Account name'] === 'Account') {
              allRows.push({
                content: row['_4'],
                role: row['Account name'] === 'Account' ? MessagingRoleValue.Assistant : MessagingRoleValue.User,
                datastoreId,
              });
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    const payload: CreateBucketStoreTransactionMessagingParams = {
      masterBucketId,
      datastoreId,

      bucketStoreData,
      messagingStoreData: allRows
    }

    const res = await createBucketStoreTransactionMessaging(payload)

    if (res && res.success) {
      return Response.json(
        res,
        { status: 200 }
      )
    } else {
      return Response.json(
        res,
        { status: 404 }
      )
    }

  } catch (error) {
    return Response.json(
      {
        success: false,
        error
      },
      { status: 404 }
    )
  }
}
