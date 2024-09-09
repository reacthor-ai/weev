import { atom, useAtomValue, useSetAtom } from 'jotai'
import { agentsAtom } from '@/store/workflow/agents/agents'

// Define types
export type MessageRole = 'system' | 'ai' | 'user'

export interface Message {
  role: MessageRole
  content: string
}

export interface ChatInput {
  [key: string]: string
}

export interface PromptFormState {
  id: string
  chat_inputs: ChatInput
  messages: Message[]
}

// Create the main atom
const promptFormStatesAtom = atom<PromptFormState[]>([])

// Getter atom
export const getPromptFormStatesAtom = atom(get => get(promptFormStatesAtom))

export const createAndSetPromptAtom = atom(null, (get, set, id: string) => {
  const currentState = get(promptFormStatesAtom)

  if (!currentState.find(prompt => prompt.id === id)) {
    const newPrompt: PromptFormState = {
      id,
      chat_inputs: {},
      messages: []
    }
    set(promptFormStatesAtom, [...currentState, newPrompt])
  }
})

export const addMessageAtom = atom(null, (get, set, index: number) => {
  const currentState = get(promptFormStatesAtom)
  const updatedState = currentState.map((prompt, i) =>
    i === index
      ? {
          ...prompt,
          messages: [
            ...prompt.messages,
            {
              role: 'system' as MessageRole,
              content: ''
            }
          ]
        }
      : prompt
  )
  set(promptFormStatesAtom, updatedState)
})

export const updateMessageAtom = atom(
  null,
  (
    get,
    set,
    update: {
      index: number
      messageIndex: number
      field: 'role' | 'content'
      value: string
    }
  ) => {
    const currentState = get(promptFormStatesAtom)
    const updatedState = currentState.map((prompt, i) =>
      i === update.index
        ? {
            ...prompt,
            messages: prompt.messages.map((message, j) =>
              j === update.messageIndex
                ? { ...message, [update.field]: update.value }
                : message
            )
          }
        : prompt
    )
    set(promptFormStatesAtom, updatedState)
  }
)

export const deleteMessageAtom = atom(
  null,
  (
    get,
    set,
    {
      index,
      messageIndex
    }: {
      index: number
      messageIndex: number
    }
  ) => {
    const currentState = get(promptFormStatesAtom)
    const updatedState = currentState.map((prompt, i) =>
      i === index
        ? {
            ...prompt,
            messages: prompt.messages.filter((_, j) => j !== messageIndex)
          }
        : prompt
    )
    set(promptFormStatesAtom, updatedState)
  }
)

export const updateChatInputAtom = atom(
  null,
  (get, set, update: { index: number; key: string; value: string }) => {
    const currentState = get(promptFormStatesAtom)
    const updatedState = currentState.map((prompt, i) =>
      i === update.index
        ? {
            ...prompt,
            chat_inputs: {
              ...prompt.chat_inputs,
              [update.key]: update.value
            }
          }
        : prompt
    )
    set(promptFormStatesAtom, updatedState)
  }
)

export const deleteChatInputAtom = atom(
  null,
  (get, set, { index, key }: { index: number; key: string }) => {
    const currentState = get(promptFormStatesAtom)
    const updatedState = currentState.map((prompt, i) => {
      if (i === index) {
        const { [key]: _, ...updatedChatInputs } = prompt.chat_inputs
        return {
          ...prompt,
          chat_inputs: updatedChatInputs
        }
      }
      return prompt
    })
    set(promptFormStatesAtom, updatedState)
  }
)

export const removeAgentPromptAndDeletePromptAtom = atom(
  null,
  (get, set, promptId: string) => {
    const currentAgents = get(agentsAtom)
    const promptFormStates = get(promptFormStatesAtom)

    // Find the index of the prompt to remove
    const index = promptFormStates.findIndex(prompt => prompt.id === promptId)

    // If the prompt isn't found, log a warning and return
    if (index === -1) {
      console.warn(`Prompt with ID ${promptId} not found`)
      return
    }

    // Update agents state
    const updatedAgents = currentAgents.map(agent =>
      agent.promptId === promptId ? { ...agent, promptId: undefined } : agent
    )

    // Update prompt form states by filtering out the removed prompt
    const updatedPromptStates = promptFormStates.filter(
      prompt => prompt.id !== promptId
    )

    // Set the new states (using fresh arrays to ensure immutability)
    set(promptFormStatesAtom, [...updatedPromptStates])
    set(agentsAtom, [...updatedAgents])
  }
)

export const useRemoveAgentPromptAndDeletePrompt = () =>
  useSetAtom(removeAgentPromptAndDeletePromptAtom)

export const usePromptFormStates = () => useAtomValue(getPromptFormStatesAtom)
export const usePromptAddMessage = () => useSetAtom(addMessageAtom)
export const usePromptUpdateMessage = () => useSetAtom(updateMessageAtom)
export const usePromptDeleteMessage = () => useSetAtom(deleteMessageAtom)
export const usePromptUpdateChatInput = () => useSetAtom(updateChatInputAtom)
export const usePromptDeleteChatInput = () => useSetAtom(deleteChatInputAtom)

export const useCreateAndSetPrompt = () => useSetAtom(createAndSetPromptAtom)

export const usePromptAddChatInput = (index: number) => {
  const updateChatInput = usePromptUpdateChatInput()
  return () => {
    const newKey = `input_${Date.now()}`
    updateChatInput({ index, key: newKey, value: '' })
  }
}

// Export the main atom if needed elsewhere
export { promptFormStatesAtom }
