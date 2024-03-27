import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import type { ChatPromptTemplate } from '@langchain/core/prompts'

import { pull } from 'langchain/hub'
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'
import { convertTypeCompletionPrompt } from '@/api-utils/models/prompt-template'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { chatOpenAI, voyageEmbeddings } from '@/api-utils/models'
import { BytesOutputParser } from '@langchain/core/output_parsers'
import { StreamingTextResponse } from 'ai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'

const research = async (researchInput: string) => {
  const tools = [
    new TavilySearchResults({
      maxResults: 10,
      apiKey: process.env.TAVILY_API_KEY as string
    })]

  const prompt = await pull<ChatPromptTemplate>(
    'hwchase17/openai-functions-agent'
  )

  const agent = await createOpenAIFunctionsAgent({
    llm: chatOpenAI,
    tools,
    prompt
  })

  const agentExecutor = new AgentExecutor({
    agent,
    tools
  })

  return await agentExecutor.invoke({
    input: researchInput
  })
}

export async function POST(request: Request) {
  const { messages } = await request.json()
  const inputMessages = messages[messages.length - 1].content

  try {
    const researchResult = await research(inputMessages)

    const vectorStore = await MemoryVectorStore.fromTexts(
      researchResult.output,
      [{}],
      voyageEmbeddings
    )

    const retriever = vectorStore.asRetriever()

    const prompt = convertTypeCompletionPrompt('generate-brand-voice')

    const formatDocs = (docs: Document[]) => docs.map((doc) => doc.pageContent)

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocs),
        question: new RunnablePassthrough()
      },
      prompt,
      chatOpenAI,
      new BytesOutputParser()
    ])

    const stream = await chain.stream('')

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(`Errro`, error)
  }

}