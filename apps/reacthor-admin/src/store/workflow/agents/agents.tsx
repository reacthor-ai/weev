import { atom, useAtomValue, useSetAtom } from 'jotai'

// Define types
type LLMType = 'ChatOpenAI' | 'GPT3' | 'GPT4'

interface LLM {
  type: LLMType
  model: string
  max_retries: number
}

interface StateUpdate {
  name: string
  _state: Record<string, any>
  tools: any[]
}

export interface AgentGraphAtom {
  name: string
  type: string
  llm: LLM
  state_updates: StateUpdate[]
}

export const agentsAtom = atom<AgentGraphAtom[]>([])

export const getAgentsAtom = atom(get => get(agentsAtom))

export const updateAgentAtom = atom(
  null,
  (get, set, newAgent: AgentGraphAtom) => {
    const currentAgents = get(agentsAtom)
    const existingAgentIndex = currentAgents.findIndex(
      agent => agent.name === newAgent.name
    )

    if (existingAgentIndex !== -1) {
      set(
        agentsAtom,
        currentAgents.map((agent, index) =>
          index === existingAgentIndex ? { ...agent, ...newAgent } : agent
        )
      )
    } else {
      set(agentsAtom, [...currentAgents, newAgent])
    }
  }
)

export const removeAgentAtom = atom(null, (get, set, agentId: string) => {
  const currentAgents = get(agentsAtom)
  set(
    agentsAtom,
    currentAgents.filter(agent => agent.name !== agentId)
  )
})

export const useAgents = () => useAtomValue(getAgentsAtom)
export const useUpdateAgent = () => useSetAtom(updateAgentAtom)
export const useRemoveAgent = () => useSetAtom(removeAgentAtom)
