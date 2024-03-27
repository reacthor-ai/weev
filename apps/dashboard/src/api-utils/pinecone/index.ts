import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { togetherAIEmbeddings } from '@/api-utils/models'

type VectorStoreParams = {
  namespace: string
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? ''
})

export const getVectorStore = async (params: VectorStoreParams) => {
  const { namespace } = params

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '')

  const vectorStore = await PineconeStore.fromExistingIndex(
    togetherAIEmbeddings,
    {
      pineconeIndex,
      namespace
    }
  )

  return vectorStore.asRetriever()
}