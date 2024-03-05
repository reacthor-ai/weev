import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { BrandVoiceType } from '@/database'

type BrandIdentityProps = {
  brandVoices: BrandVoiceType[]
}

export const BrandIdentity = (props: BrandIdentityProps) => {
  const { brandVoices } = props

  return (
    <>
      {
        brandVoices.map(brand => {
          return (
            <Card key={brand.id} className='w-[350px] bg-white rounded-lg shadow-md p-1'>
              <CardHeader className='mb-2'>
                <Badge
                  className='rounded-full w-[100%] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 bg-blue-200'
                  variant='secondary'
                >
                  {brand.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <h3 className='text-lg font-semibold leading-tight text-gray-900'>{brand.title}</h3>
                <p className='text-sm text-gray-500'>{brand.description}</p>
              </CardContent>
            </Card>
          )
        })
      }
    </>
  )
}

