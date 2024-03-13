import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CopyrightingProductProps = {
  brandUploadProgress: string
  setBrandVoiceId: (value: string) => void
  brandVoices: Array<any>
}

export const CopyrightingProduct = (props: CopyrightingProductProps) => {
  const { brandUploadProgress, setBrandVoiceId, brandVoices } = props
  return (
    <div>
      <h1 className='text-2xl font-bold'>New Product</h1>
      <div className='space-y-4'>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
            Choose your Brand Identity *
          </label>
          <p className='my-2'>{brandUploadProgress}</p>
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
      </div>
    </div>
  )
}