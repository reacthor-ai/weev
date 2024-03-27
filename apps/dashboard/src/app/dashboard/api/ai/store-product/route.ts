import { z } from 'zod'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { mistralAI } from '@/api-utils/models'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { createProduct, updateProduct } from '@/database/products/products'

const zodSchema = z.object({
  'productName': z.string(),
  'productDescription': z.string()
})

export async function POST(req: Request) {
  const { output, projectId, brandVoiceId, action_type = 'create-product', productId, inputPrompt } = await req.json()

  const content = output.replace(/[^a-zA-Z0-9]/g, ' ')

  const parser = StructuredOutputParser.fromZodSchema(zodSchema)

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'Answer the user query. Wrap the output in `json` tags\n{format_instructions}'
    ],
    ['human', '{query}']
  ])

  const partialedPrompt = await prompt.partial({
    format_instructions: parser.getFormatInstructions()
  })

  const chain = partialedPrompt.pipe(mistralAI).pipe(parser)

  const answer = await chain.invoke({ query: content })

  if (!answer) {
    return Response.json({
      success: false,
      error: 'Error when returning output',
      result: null
    }, { status: 404 })
  }

  if (action_type === 'create-product' && !productId) {
    const product = await createProduct({
      description: answer.productDescription,
      title: answer.productName,
      projectId,
      brandVoiceId,
      prompt: { text: output, prompt: inputPrompt }
    })

    return Response.json({
      success: true,
      result: product,
      error: null
    }, { status: 200 })
  } else if (action_type === 'update-product' && productId) {
    const product = await updateProduct({
      description: answer.productDescription,
      title: answer.productName,
      projectId,
      brandVoiceId,
      prompt: { text: output, prompt: inputPrompt },
      productId
    })

    return Response.json({
      success: true,
      result: product,
      error: null
    }, { status: 200 })
  }
}