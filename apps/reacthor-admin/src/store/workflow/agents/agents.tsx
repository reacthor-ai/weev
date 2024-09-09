import { atom, useAtomValue, useSetAtom } from 'jotai'

// Define types
type LLMType = 'ChatOpenAI' | 'GPT3' | 'GPT4'

export type PromptMessageId = string

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
  promptId: PromptMessageId | undefined
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

export const updateAgentPromptIdAtom = atom(
  null,
  (
    get,
    set,
    { name, promptId }: { name: string; promptId: PromptMessageId }
  ) => {
    const currentAgents = get(agentsAtom)
    const updatedAgents = currentAgents.map(agent => {
      if (agent.name === name) {
        // Only update if the current promptId is undefined
        if (agent.promptId === undefined) {
          return { ...agent, promptId }
        }
        // If the promptId is already defined, return the agent unchanged
        return agent
      }
      return agent
    })

    // Set the updated agents
    set(agentsAtom, updatedAgents)
  }
)

export const resetAgentPromptIdAtom = atom(
  null,
  (get, set, agentId: string) => {
    const currentAgents = get(agentsAtom)
    const updatedAgents = currentAgents.map(agent => {
      if (agent.name === agentId) {
        // Set promptId to undefined
        return { ...agent, promptId: undefined }
      }
      return agent
    })

    // Set the updated agents
    set(agentsAtom, updatedAgents)
  }
)

export const checkPromptIdExistsAtom = atom(get => (agentId: string) => {
  // allow promptId to be undefined
  const currentAgents = get(agentsAtom)

  // Find the agent with the specified ID
  const currentAgent = currentAgents.find(agent => agent.name === agentId)
  if (currentAgent) {
    // Check if the current agent already has the given promptId
    // Safeguard the comparison for when promptId is undefined
    return typeof currentAgent.promptId !== 'undefined'
  }

  return false // If the agent is not found, return false
})

export const useInitializeAgentNode = () => {
  const updateAgent = useUpdateAgent()
  const agents = useAgents()

  return (
    id: string,
    type:
      | 'toolAgentComponent'
      | 'chatAgentComponent'
      | 'ToolsAgentComponent'
      | 'ChatAgentComponent'
  ) => {
    const agentExists = agents.some(agent => agent.name === id)
    if (!agentExists) {
      const defaultAgent = {
        id,
        name: id,
        type:
          type === 'toolAgentComponent'
            ? 'ToolsAgentComponent'
            : 'ChatAgentComponent',
        llm: {
          type: 'ChatOpenAI',
          model: 'gpt-4o-mini',
          max_retries: 1
        },
        state_updates: [
          {
            name: 'UpdateAgentNodeName',
            _state: {
              greet: true
            },
            tools: []
          }
        ],
        promptId: undefined
      }
      updateAgent(defaultAgent as any)
    }
  }
}

export const useResetAgentPromptId = () => useSetAtom(resetAgentPromptIdAtom)

export const useUpdateAgentPromptId = () => useSetAtom(updateAgentPromptIdAtom)

export const useCheckPromptIdExists = () =>
  useAtomValue(checkPromptIdExistsAtom)

export const useAgents = () => useAtomValue(getAgentsAtom)
export const useUpdateAgent = () => useSetAtom(updateAgentAtom)
export const useRemoveAgent = () => useSetAtom(removeAgentAtom)
