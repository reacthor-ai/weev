'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import svg1 from '../../../public/32.svg'
import svg2 from '../../../public/46.svg'
import svg3 from '../../../public/54.svg'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

let count = 0
const showcaseContent = [
  {
    id: count++,
    title: 'Create Your brand Voice',
    image: svg1,
    btnText: 'New Brand Voice',
    linkTo: NAVIGATION.BRAND_VOICE
  }, {
    id: count++,
    title: 'Organize your projects',
    image: svg2,
    btnText: 'Create',
    linkTo: NAVIGATION.PROJECTS
  }, {
    id: count++,
    title: 'Create your products',
    image: svg3,
    btnText: 'Create',
    linkTo: NAVIGATION.PROJECTS
  }
]

export const Showcase = () => {
  const router = useRouter()
  return (
    <div className='grid grid-cols-3 gap-8'>
      {
        showcaseContent.map((content) => {
          return (
            <Card className='flex items-center justify-center flex-col' key={content.id}>
              <CardHeader className='flex items-center justify-center'>
                <CardTitle>{content.title}</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center flex-col justify-center'>
                <Image
                  alt='weeev-logo'
                  height={50}
                  className='block m-auto'
                  width={150}
                  style={{
                    aspectRatio: '100/100',
                    objectFit: 'cover'
                  }}
                  src={content.image}
                />

                <Button className='mt-4' onClick={() => router.push(content.linkTo)}>{content.btnText}</Button>
              </CardContent>
            </Card>
          )
        })
      }
    </div>
  )
}
