'use client'

import { CornerDownLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BrandVoiceType } from '@/database'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChat } from 'ai/react'
import { twMerge } from 'tailwind-merge'

type KnowledgeHubProps = {
  brandVoices: BrandVoiceType[]
}

type ChatMessageContent = {
  type: string
  content: string
}

export function KnowledgeHub(props: KnowledgeHubProps) {
  const { brandVoices } = props
  const [brandVoiceId, setBrandVoiceId] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatMessageContent[]>([])

  const { messages, isLoading, input, handleInputChange, handleSubmit } = useChat({
    api: '/dashboard/api/ai/knowledge-brand-voice',
    body: {
      brandVoiceId,
      type_of_completion: 'knowledge-prompt',
      brandVoices
    }
  })

  const getChatHistory = useCallback(async () => {
    if (!brandVoiceId) return

    try {
      const response = await fetch(`/dashboard/api/ai/get-chat-history?id=${brandVoiceId}`)
      const data = await response.json()
      setChatHistory(data.response)
    } catch (e) {
      setChatHistory([])
    }
  }, [brandVoiceId])

  useEffect(() => {
    getChatHistory()
  }, [getChatHistory])

  const isDisabled = () => brandVoiceId.length === 0

  const allMessages = useMemo(() => {
    let content: ChatMessageContent[] = []

    content = [...messages.map((s) => ({ content: s.content, type: s.role })), ...chatHistory]

    return content.reverse()
  }, [messages, chatHistory])

  return (
    <div className='grid h-screen w-full'>
      <div className='flex flex-col'>
        <main className='grid flex-1 gap-4 overflow-auto px-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='relative hidden flex-col items-start gap-8 md:flex'>
            <form className='grid w-full items-start gap-6'>
              <fieldset className='grid gap-6 rounded-lg border p-4'>
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  Chat history
                </legend>
                <div className='grid gap-3'>
                  <Label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                    Coming soon...
                  </Label>

                </div>
              </fieldset>
              <fieldset className='grid gap-6 rounded-lg border p-4'>
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  Settings
                </legend>
                <div className='grid gap-3'>
                  <Label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                    Choose your Brand Identity *
                  </Label>
                  <Select onValueChange={setBrandVoiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Brand Identities' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {
                          brandVoices.map(brandVoice => {
                            return (
                              <SelectItem
                                key={brandVoice.id}
                                title={brandVoice.title}
                                value={brandVoice.id}
                              >
                                {brandVoice.title}
                              </SelectItem>
                            )
                          })
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </fieldset>
            </form>

          </div>
          <div className='relative flex h-[13%] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            <Badge variant='outline' className='absolute right-3 top-3'>
              Output
            </Badge>
            {/* Scrollable message list */}
            <div className='flex-1 overflow-auto'>
              <p className='text-gray-800 space-y-2'>
                {allMessages.map((message, index) => {
                  const isUser = message.type === 'user'
                  return (
                    <div
                      key={index} // Remember to use a better key in a real app
                      className={`mb-2 flex items-center justify-start gap-x-2 ${!isUser && 'mt-2'}`}
                    >
                      {isUser && (
                        <div
                          className='flex h-8 w-8 items-center justify-center rounded-full border border-border'>
                          <svg
                            width='12'
                            height='16'
                            viewBox='0 0 12 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M6 0.497864C4.34315 0.497864 3 1.84101 3 3.49786C3 5.15472 4.34315 6.49786 6 6.49786C7.65685 6.49786 9 5.15472 9 3.49786C9 1.84101 7.65685 0.497864 6 0.497864ZM9.75 7.99786L2.24997 7.99787C1.00734 7.99787 0 9.00527 0 10.2479C0 11.922 0.688456 13.2633 1.81822 14.1701C2.93013 15.0625 4.42039 15.4979 6 15.4979C7.57961 15.4979 9.06987 15.0625 10.1818 14.1701C11.3115 13.2633 12 11.922 12 10.2479C12 9.00522 10.9926 7.99786 9.75 7.99786Z'
                              fill='#9CA3AF'
                            />
                          </svg>
                        </div>
                      )}

                      <div
                        className={twMerge(
                          'text-sm font-extrabold capitalize',
                          isUser && 'text-gray-500'
                        )}
                      >
                        {isUser
                          ? message.type
                          : message.type}
                      </div>
                      {message.content}
                    </div>
                  )
                })}
              </p>
            </div>
            {/* Sticky input form */}
            <form
              onSubmit={handleSubmit}
              className='rounded-lg border bg-background p-3 focus-within:ring-1 focus-within:ring-ring shadow-lg'
            >
              <Label htmlFor='message' className='sr-only'>
                Message
              </Label>
              <Textarea
                id='message'
                placeholder='Type your message here...'
                value={input}
                onChange={handleInputChange}
                className='min-h-[3rem] w-full resize-none border-0 p-2 shadow-none focus:ring-0'
              />
              <Button
                disabled={isDisabled()}
                type='submit'
                className='ml-auto flex items-center gap-1.5 mt-2'
              >
                {isLoading ? 'Sending message...' : 'Send Message'}
                <CornerDownLeft className='size-3.5' />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
