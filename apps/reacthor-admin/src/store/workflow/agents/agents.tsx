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

export const updateAgentsAtom = atom(
  get => get(agentsAtom),
  (get, set, newAgent: AgentGraphAtom) => {
    const currentAgents = get(agentsAtom)
    const existingAgentIndex = currentAgents.findIndex(
      agent => agent.name === newAgent.name
    )

    if (existingAgentIndex !== -1) {
      // Update existing agent
      set(
        agentsAtom,
        currentAgents.map((agent, index) =>
          index === existingAgentIndex ? { ...agent, ...newAgent } : agent
        )
      )
    } else {
      // Add new agent
      set(agentsAtom, [...currentAgents, newAgent])
    }
  }
)

export const removeAgentsAtom = atom(
  get => get(agentsAtom),
  (get, set, agentId: string) => {
    const currentAgents = get(agentsAtom)

    const updatedAgents = currentAgents.filter(agent => agent.name !== agentId)
    set(agentsAtom, updatedAgents)
  }
)

export const useRemoveAgentAtom = () => useSetAtom(removeAgentsAtom)

export const useUpdateAgent = () => useSetAtom(updateAgentsAtom)

export const useAgents = () => useAtomValue(agentsAtom)
