import { Chat } from '@/db/playground/chat/Chat'
import { nanoid } from 'nanoid'

export const Playground = () => {
  const id = nanoid()

  return <Chat id={id} />
}
