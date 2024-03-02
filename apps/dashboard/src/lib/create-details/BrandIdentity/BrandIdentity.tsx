import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { UploadFiles } from '@/lib/create-details/BrandIdentity/Upload'
import { Input } from '@/components/ui/input'

export const BrandIdentityCreateDetails = () => {
  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-2'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>New Brand Voice</h1>
            <div className='space-y-4'>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                  Brand Name *
                </label>
                <Input
                  placeholder='You brand Name for reference'
                />
              </div>
              <div>
                <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Brand Story (Should be 300 words or more). *
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your brand story'
                />
              </div>
            </div>
            <Button className='bg-blue-600 text-white w-full'>Generate content</Button>
          </div>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-xl font-semibold'>Upload your brand guidelines</h2>
              <div>
                <UploadFiles />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Target Audience
                </label>
                <Input

                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Tone of Voice
                </label>
                <Input

                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Emotions
                </label>
                <Input

                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Photography Guideline Summary
                </label>
                <Input

                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
