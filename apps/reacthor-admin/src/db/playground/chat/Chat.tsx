'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChatPanel } from '@/db/playground/chat/ChatPanel'
import { useChat } from 'ai/react'

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string
}

export function Chat({ id }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const { messages } = useChat()

  const [chatId, setNewChatId] = useState<string | undefined>('')

  useEffect(() => {
    const messagesLength = messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [messages, router])

  useEffect(() => {
    setNewChatId(id)
  })

  return (
    <div className="text-white group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <ChatPanel id={id} input={input} setInput={setInput} />
    </div>
  )
}
