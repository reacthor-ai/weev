import { getDatabaseChatMemory } from '@/clients/planetscale'
import { getVectorStore } from '@/clients/pinecone'
import { BufferMemory } from 'langchain/memory'
import { templatePrompts } from '@/clients/agents/template'
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { ChatOpenAI } from '@langchain/openai'
import { BaseMessage } from '@langchain/core/messages'
import { Message } from 'ai'

// https://github.com/line/line-bot-sdk-nodejs/blob/master/examples/echo-bot-ts-esm/index.ts

export type CustomerServiceAgentParams = {
  inputVariables?: string[]
  channelId: string
  messages: Message[]
  agentName: string
  companyName: string
}

/**
 * Over here we'll need to detect a
 * document by a specific tag, for example.
 */
export const customerServiceAgent = async ({
  channelId,
  companyName,
  agentName,
  messages
}: CustomerServiceAgentParams) => {
  try {
    const question = messages[messages.length - 1].content

    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'ft:gpt-3.5-turbo-0125:reacthor::9F2q4uDm:ckpt-step-60'
    })

    const retriever = await getVectorStore({
      namespace: 'clucex9970001te40he9yz7dv'
    })

    const conversational_history = getDatabaseChatMemory(
      '55955b28-ad61-415e-a506-e5c8ef92595b'
    )

    const memory = new BufferMemory({
      chatHistory: conversational_history,
      memoryKey: 'chat_history',
      returnMessages: true,
      inputKey: 'question',
      outputKey: 'text'
    })
    const template = templatePrompts('conversational')

    const responseChainPrompt = ChatPromptTemplate.fromMessages<{
      context: string
      chat_history: BaseMessage[]
      question: string
    }>([
      ['system', template],
      new MessagesPlaceholder('chat_history'),
      ['user', `{input}`]
    ])

    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt: responseChainPrompt
    })

    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain: ragChain
    })

    const m = await memory.loadMemoryVariables({})
    const chat_history = m['chat_history'] ?? []

    const response = await retrievalChain.invoke({
      input: question,
      chat_history,
      company_name: companyName,
      agent_name: agentName
    })

    if (response.answer) {
      await memory.saveContext(
        {
          question: question
        },
        {
          text: response.answer
        }
      )
      return Response.json(
        {
          response,
          error: null
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.log('error', error)
    return Response.json(
      {
        response: null,
        error
      },
      { status: 404 }
    )
  }
}
