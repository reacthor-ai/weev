import { ChatMistralAI } from '@langchain/mistralai'

export const mistralAI = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY!,
  modelName: 'mistral-large-latest'
})