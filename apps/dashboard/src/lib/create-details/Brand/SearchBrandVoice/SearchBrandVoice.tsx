import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { BrandProps } from '../Brand'
import { useChat } from 'ai/react'

export const SearchBrandVoice = (props: BrandProps) => {
  const {} = props
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [isProgress, setIsProgress] = useState(false)

  const {
    messages,
    handleSubmit,
    reload,
    setMessages,
    isLoading,
    input,
    handleInputChange
  } = useChat({
    api: '/dashboard/api/ai/search-brand-voice'
  })

  const onSubmit = (e, c) => {
    setMessages([])
    return handleSubmit(e, c)
  }

  const saveBrandVoice = async () => {
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-2'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>Search Brand Voice</h1>
            <form onSubmit={onSubmit as any} className='space-y-4'>
              <div>
                <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='brand-story'>
                  Which company you'd like to research about?
                </label>
                <Textarea
                  className='h-[160px]'
                  placeholder='Write about the type of brand you want'
                  value={input}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                disabled={input.length <= 0}
                className='bg-blue-600 text-white w-full' type='submit'>
                {loading ? 'Loading content...' : 'Generated Content'}
              </Button>
            </form>
          </div>

          <div>
            <h2
              className='text-xl font-semibold'>{isLoading ? 'Generating your brand voice based on the research please wait..\n' : ''}</h2>
            <p className='text-gray-800'>
              {
                messages.map(val => {
                  return <>{val.role === 'assistant' ? (
                    <>
                      <div className='flex flex-row mr-2'>
                        <div>
                          <Button disabled={isProgress} onClick={saveBrandVoice}>{
                            `${isProgress ? 'Saving product...' : 'Save content'}`
                          }</Button>
                        </div>
                        <br />
                        <div className='mx-4'>
                          <Button onClick={() => {
                            setMessages([])
                          }}>
                            Reset
                          </Button>
                        </div>
                        <br />
                        <div>
                          <Button onClick={() => {
                            return reload()
                          }}>
                            Redo message
                          </Button>
                        </div>
                      </div>
                      {'\n'}
                      <br />
                      <br />
                      {val.content}
                    </>
                  ) : ''}</>
                })
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}