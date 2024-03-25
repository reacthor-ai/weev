'use client'

import { CornerDownLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BrandVoiceType } from '@/database'
import { useState } from 'react'
import { useChat } from 'ai/react'

type KnowledgeHubProps = {
  brandVoices: BrandVoiceType[]
}

export function KnowledgeHub(props: KnowledgeHubProps) {
  const { brandVoices } = props
  const [brandVoiceId, setBrandVoiceId] = useState<string>('')

  const { messages, isLoading, input, handleInputChange, handleSubmit } = useChat({
    api: '/dashboard/api/ai/retrieve-brand-voice',
    body: {
      brandVoiceId,
      type_of_completion: 'general'
    }
  })

  const isDisabled = () => brandVoiceId.length === 0

  return (
    <div className='grid h-screen w-full'>
      <div className='flex flex-col'>
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='relative hidden flex-col items-start gap-8 md:flex'>
            <form className='grid w-full items-start gap-6'>
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
          <div className='relative flex h-[70%] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            <Badge variant='outline' className='absolute right-3 top-3'>
              Output
            </Badge>
            <div className='flex-1 overflow-auto'>
              <p className='text-gray-800'>
                {
                  messages.map(message => {
                    return (
                      <>
                        {message.role === 'user' ? <>User: <p
                          className='font-bold'>{message.content}</p>{'\n'}</> : <></>}{'\n'}
                        <br />
                        {message.role === 'assistant' ? <>{'\n'}Assistant: {message.content}{'\n'}</> : <></>}{'\n'}
                        <br />
                      </>
                    )
                  })
                }
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className='relative overflow-hidden mt-5 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'>
              <Label htmlFor='message' className='sr-only'>
                Message
              </Label>
              <Textarea
                id='message'
                placeholder='Type your message here...'
                value={input}
                onChange={handleInputChange}
                className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0'
              />
              <div className='flex items-center p-3 pt-0'>
                <Button disabled={isDisabled()} type='submit' size='sm' className='ml-auto gap-1.5'>
                  {isLoading ? 'Sending message...' : 'Send Message'}
                  <CornerDownLeft className='size-3.5' />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
