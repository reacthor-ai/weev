import { getVectorStore } from '@/api-utils/pinecone'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { BytesOutputParser } from '@langchain/core/output_parsers'
import { StreamingTextResponse } from 'ai'
import { mistralAI } from '@/api-utils/models'

const convertTypeCompletionPrompt = (type_of_completion: 'generate-product' | 'general') => {
  const generalPrompt = ChatPromptTemplate.fromTemplate(`Answer the question in a simple sentence based only on the following context:
    {context}
    
    Question: {question}`)

  const generateProduct = ChatPromptTemplate.fromTemplate(`
      // This template is designed to generate product titles and descriptions based on specific marketing requirements. 
      // It must not be used for any other purpose. If the input does not meet the criteria for generating a product 
      // title and description, the template should automatically respond with a limitation notice.
    
      Given the marketing requirements:
      {context}
    
      This tool is specialized in creating:
      1. A compelling product title, and
      2. A detailed product description not exceeding 300 words.
      
      These outputs should directly align with the provided marketing requirements.
    
      If the request deviates from these specific tasks, such as asking for advice, general information, or any task not related to generating a product title and description based on the given marketing requirements, the template should respond with:
      "Sorry, I can only help with generating a product title and description based on marketing requirements."
    
      Question: Based on the provided marketing requirements, what are a suitable product title and a detailed product description for the question: {question}?
    
      // Ensure this strict adherence to the task at hand to maintain focus and efficiency.
    `)

  const product = {
    'generate-product': generateProduct,
    'general': generalPrompt
  }

  return product[type_of_completion]
}

export async function POST(req: Request) {
  const { brandVoiceId, messages, type_of_completion } = await req.json()
  const inputMessages = messages[messages.length - 1].content

  const retriever = await getVectorStore({
    namespace: brandVoiceId
  })

  const prompt = convertTypeCompletionPrompt(type_of_completion)

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