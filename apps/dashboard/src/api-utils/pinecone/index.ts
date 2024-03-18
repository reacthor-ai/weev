import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { TogetherAIEmbeddings } from '@langchain/community/embeddings/togetherai'

type VectorStoreParams = {
  namespace: string
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? ''
})

export const getVectorStore = async (params: VectorStoreParams) => {
  const { namespace } = params

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '')

  const embeddings = new TogetherAIEmbeddings({
    apiKey: process.env.TOGETHER_AI_API_KEY,
    modelName: 'togethercomputer/m2-bert-80M-8k-retrieval'
  })

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace
    }
  )

  return vectorStore.asRetriever()
}