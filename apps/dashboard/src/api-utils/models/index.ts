import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'
import { VoyageEmbeddings } from '@langchain/community/embeddings/voyage'
import { TogetherAIEmbeddings } from '@langchain/community/embeddings/togetherai'

export const mistralAI = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY!,
  modelName: 'mistral-large-latest'
})

export const chatOpenAI = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY as string
})

export const voyageEmbeddings = new VoyageEmbeddings({
  apiKey: process.env.VOYAGE_API_KEY as string,
  modelName: 'voyage-large-2'
})

export const togetherAIEmbeddings = new TogetherAIEmbeddings({
  apiKey: process.env.TOGETHER_AI_API_KEY,
  modelName: 'togethercomputer/m2-bert-80M-8k-retrieval'
})