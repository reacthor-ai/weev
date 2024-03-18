import { getVectorStore } from '@/api-utils/pinecone'
import { ChatMistralAI } from '@langchain/mistralai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { BytesOutputParser } from '@langchain/core/output_parsers'
import { StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { namespace, messages } = await req.json()
  const inputMessages = messages ?? []

  const retriever = await getVectorStore({
    namespace
  })

  const model = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY!,
    modelName: 'mistral-large-latest',
    streaming: true
  })

  const prompt =
    PromptTemplate.fromTemplate(`Answer the question based only on the following context:
      {context}

      Question: {question}`)

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough()
    },
    prompt,
    model,
    new BytesOutputParser()
  ])

  const stream = await chain.stream({
    input: inputMessages
  })

  return new StreamingTextResponse(stream)
}