import { getVectorStore } from '@/api-utils/pinecone'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { BytesOutputParser } from '@langchain/core/output_parsers'
import { StreamingTextResponse } from 'ai'
import { mistralAI } from '@/api-utils/models'
import { convertTypeCompletionPrompt } from '@/api-utils/models/prompt-template'

export async function POST(req: Request) {
  const { brandVoiceId, messages, type_of_completion, brandVoices } = await req.json()
  const inputMessages = messages[messages.length - 1].content

  const retriever = await getVectorStore({
    namespace: brandVoiceId
  })

  const prompt = convertTypeCompletionPrompt(type_of_completion, brandVoices)

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough()
    },
    prompt,
    mistralAI,
    new BytesOutputParser()
  ])

  const stream = await chain.stream(inputMessages)

  return new StreamingTextResponse(stream)
}