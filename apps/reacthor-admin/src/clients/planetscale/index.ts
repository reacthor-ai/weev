import { PlanetScaleChatMessageHistory } from '@langchain/community/stores/message/planetscale'

import { Client } from '@planetscale/database'

const planetscaleClient = new Client({
  url: process.env.PLANET_SCALE_DATABASE_URL!
})

export const getDatabaseChatMemory = (sessionId: string) => {
  return new PlanetScaleChatMessageHistory({
    tableName: 'chat_voice',
    sessionId,
    client: planetscaleClient
  })
}