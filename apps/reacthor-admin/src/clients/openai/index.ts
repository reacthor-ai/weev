import OpenAI from 'openai'
import fs from 'fs'
import { reacthorDbClient } from '@/db'
import { STORAGE_PREFIX } from '@/shared-utils/constant/prefix'
import { bucket } from '@/clients/gcp'

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export type UploadMessagesToJsonAndUseParams = {
  dataStoreId: string
  organizationId: string
  finetuneBucketId: string
  assistantChat: string
  title: string
  batchSize?: number
  learningRate?: number
  numOfEpochs?: number
}

const uploadMessagesTrigger = async (
  params: Pick<
    UploadMessagesToJsonAndUseParams,
    'dataStoreId' | 'assistantChat' | 'organizationId'
  > & {
    finetuneId: string
  }
) => {
  const { dataStoreId, finetuneId, organizationId, assistantChat } = params

  const folderPath = `${STORAGE_PREFIX.organization.home(
    organizationId
  )}/${STORAGE_PREFIX.organization.line.fine_tune.merged(finetuneId)}`

  // Fetch messages from the database
  const messages = await reacthorDbClient.messaging.findMany({
    where: { datastoreId: dataStoreId }
  })

  // Step 1: Group the messages by their 'group' attribute
  const groupedMessages = messages.reduce((acc: any, message: any) => {
    if (!acc[message.group]) {
      acc[message.group] = []
    }
    acc[message.group].push(message)
    return acc
  }, {})

  // Step 2: Transform each group to match the desired output format
  const mergedMessages = Object.values(groupedMessages)
    .map((group: any) => ({
      messages: group.map((msg: any) => ({
        role: msg.role.toLowerCase(), // Transform role to lowercase
        content: msg.content
      }))
    }))
    .filter(md => md.messages.length === 2)
    .map(ms => ({
      messages: [...ms.messages, { role: 'system', content: assistantChat }]
    }))

  const jsonlData = mergedMessages
    .map(group => JSON.stringify(group))
    .join('\n')

  const tempFilename = STORAGE_PREFIX.organization.ai.open_ai.folder(finetuneId)
  fs.writeFileSync(tempFilename, jsonlData)

  // Upload the JSONL file to Google Cloud Storage
  const file = bucket.file(folderPath)
  await file.save(jsonlData)

  // Upload the JSONL file to OpenAI for fine-tuning
  const fileStream = fs.createReadStream(tempFilename)

  return [fileStream, tempFilename]
}

export async function uploadMessagesToJsonlAndUse({
  dataStoreId,
  organizationId,
  assistantChat,
  title
}: UploadMessagesToJsonAndUseParams) {
  const fineTuneJob = await reacthorDbClient.finetuneJob.create({
    data: {
      title,
      dataStoreId,
      organizationId
    }
  })

  const finetuneId = fineTuneJob.id

  const [fileStream, tempFilename]: any = await uploadMessagesTrigger({
    finetuneId,
    assistantChat,
    dataStoreId,
    organizationId
  })

  try {
    const openAIFile = await openAI.files.create({
      file: fileStream,
      purpose: 'fine-tune'
    })

    // Cleanup: Delete the temporary file
    fs.unlinkSync(tempFilename)

    if (openAIFile.id) {
      const fineTuneJob = await openAI.fineTuning.jobs.create({
        model: 'gpt-3.5-turbo-0125',
        training_file: openAIFile.id,
        hyperparameters: {
          batch_size: 'auto',
          n_epochs: 'auto',
          learning_rate_multiplier: 'auto'
        }
      })

      if (fineTuneJob.id) {
        const updateFineTune = await reacthorDbClient.finetuneJob.update({
          where: { id: finetuneId },
          data: {
            fineTuneJobId: fineTuneJob.id,
            openAiFileId: openAIFile.id,
            batchSize: 0,
            learningRate: 0,
            numOfEpochs: 0
          }
        })

        if (updateFineTune.id) {
          return Response.json(
            {
              success: true,
              data: updateFineTune,
              error: null
            },
            { status: 200 }
          )
        } else {
          return Response.json(
            {
              success: true,
              data: null,
              error: 'Failed to update data in db'
            },
            { status: 400 }
          )
        }
      } else {
        return Response.json(
          {
            success: true,
            data: null,
            error: 'Failed to fine_tune data'
          },
          { status: 400 }
        )
      }

    } else {
      return Response.json(
        {
          success: true,
          data: null,
          error: 'Failed to run.'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        error
      },
      { status: 404 }
    )
  }
}
