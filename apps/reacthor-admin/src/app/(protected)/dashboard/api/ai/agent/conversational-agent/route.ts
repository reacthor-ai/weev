import { customerServiceAgent, type CustomerServiceAgentParams } from '@/clients/agents/conversational'

export async function POST(req: Request) {
  const params: CustomerServiceAgentParams = await req.json()
  return await customerServiceAgent(params)
}
