import { ChatMistralAI } from '@langchain/mistralai'
import { TogetherAIEmbeddings } from '@langchain/community/embeddings/togetherai'

export const mistralAI = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY!,
  modelName: 'mistral-large-latest'
})

export const togetherAIEmbeddings = new TogetherAIEmbeddings({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  modelName: 'togethercomputer/m2-bert-80M-8k-retrieval'
})