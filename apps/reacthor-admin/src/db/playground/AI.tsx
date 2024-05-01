import 'server-only'

import { createAI, getAIState } from 'ai/rsc'
import { AIState, Chat, UIState } from '@/db/playground/actions'
import { nanoid } from 'nanoid'
import { BotMessage, UserMessage } from '@/db/playground/message/Message'

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage: []
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },

  // @ts-ignore
  unstable_onGetUIState: async () => {
    'use server'

    const aiState = getAIState()

    if (aiState) {
      const uiState = getUIStateFromAIState(aiState)
      return uiState
    } else {
      return;
    }
  },
  unstable_onSetAIState: async ({ state, done }: any) => {
    'use server'
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
