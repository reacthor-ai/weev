import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeStore } from '@langchain/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { pinecone } from '@/api-utils/pinecone'
import { Document } from 'langchain/document'
import { togetherAIEmbeddings } from '@/api-utils/models'

const processFile = async (url: string) => {
  try {
    const response = await fetch(url)

    const blob = await response.blob()

    const loader = new TextLoader(blob)
    const rawDocs = await loader.load()

    return { success: true, rawDocs, error: null }
  } catch (error) {
    return { success: false, rawDocs: null, error }
  }
}

const processEmbeddings = async (rawDocs, namespace: string) => {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })
    const docs = await textSplitter.splitDocuments(rawDocs)

    const newDocs = [
      ...docs,
      new Document({ pageContent: `Document namespace: ${namespace}`, metadata: { namespace } })
    ]

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '')

    await PineconeStore.fromDocuments(newDocs, togetherAIEmbeddings, {
      pineconeIndex: index,
      namespace,
      textKey: 'text'
    })

    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

export async function POST(request: Request) {
  const { url, namespace } = await request.json()

  const { rawDocs, success: isFileProcessed, error: fileProcessingError } = await processFile(url)

  if (!isFileProcessed) {
    return Response.json({
      error: fileProcessingError ?? 'Error when [processFile]',
      success: false,
      rawDocs: null
    })
  }

  const { success: isEmbeddingsSuccess, error: embeddingErrors } = await processEmbeddings(rawDocs, namespace)

  if (!isEmbeddingsSuccess) {
    return Response.json({
      error: embeddingErrors ?? 'Error when [processEmbeddings]',
      success: false,
      rawDocs: null
    })
  }

  return Response.json({ error: null, success: true })
}