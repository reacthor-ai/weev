import { getVectorStore } from '@/api-utils/pinecone'
import { experimental_StreamData, LangChainStream, StreamingTextResponse } from 'ai'
import { BufferMemory } from 'langchain/memory'
import { mistralAIStream } from '@/api-utils/models'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { getDatabaseChatMemory } from '@/api-utils/planetscale'

const CONDENSE_TEMPLATE = `Return text in the original language of the follow up question.
    If the follow up question does not need context, return the exact same text back.
    Never rephrase the follow up question given the chat history unless the follow up question needs context.
    Don't repeat the question from the user.
    
    Chat History: {chat_history}
    Follow Up question: {question}
    Standalone question:`


/**
 * Knowledge brand voice.
 * (PDF & chat message history) with streaming.
 */
export async function POST(req: Request) {
  const { brandVoiceId, messages, type_of_completion, brandVoices } = await req.json()

  const inputMessages = messages[messages.length - 1].content

  try {
    const retriever = await getVectorStore({
      namespace: brandVoiceId
    })

    const history = await getDatabaseChatMemory(brandVoiceId)

    const { stream, handlers } = LangChainStream({
      experimental_streamData: true
    })

    const data = new experimental_StreamData()

    const chain1 = ConversationalRetrievalQAChain.fromLLM(
      mistralAIStream,
      retriever,
      {
        questionGeneratorTemplate: CONDENSE_TEMPLATE,
        memory: new BufferMemory({
          chatHistory: history,
          memoryKey: 'chat_history',
          returnMessages: true,
          inputKey: 'question',
          outputKey: 'text'
        })
      }
    )

    chain1.call({ question: inputMessages, chat_history: history }, [handlers])
      .then().finally(() => {
      data.close()
    })

    return new StreamingTextResponse(stream, {}, data)
  } catch (error) {
    console.error(error)
    throw new Error('Call chain method failed to execute successfully!!')
  }
}