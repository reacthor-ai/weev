import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const EditProducts = () => {
  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg pb-10 shadow-lg overflow-hidden'>
        <div className='grid grid-cols-2'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>Product descriptions</h1>
            <div>
              <h2 className='text-md block font-medium text-gray-700'>Brand Name: Company Information</h2>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                  Product name *
                </label>
                <Input
                  defaultValue='Jayne Knit Short PJ Set'
                  id='product-name'
                  placeholder="What's the name of the product and style?"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Product Description *
                </label>
                <Textarea
                  className='h-[360px]'
                  defaultValue='Knit short PJ set\nRayon/Spandex\nShort-sleeve top with notch collar\nContrast piping detail\nFabric-covered buttons\nSeashell pink\nXS–XL'
                  id='product-attributes'
                />
              </div>
              <Button className='bg-blue-600 text-white w-full'>Generate content</Button>
              <div>
                <label className='block mb-4 text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Imagery guidelines (Direct the prompt to the type of image)
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your imagery guidelines brief'
                />
              </div>
            </div>
            <Button className='bg-blue-600 text-white w-full'>Generate Image</Button>
          </div>
          <div className='p-8 space-y-4'>
            <div>
              <Image
                src={'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/128ec322-26f3-447e-8b92-bf5b644cb76b/variations/Default_Experience_the_perfect_blend_of_fashion_and_sustainabi_0_128ec322-26f3-447e-8b92-bf5b644cb76b_0.jpg?w=512'}
                alt={'image logo'}
                width={500}
                height={500}
                className='rounded-md'
              />
            </div>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Jayne Knit Short PJ Set</h2>
            </div>
            <p className='text-gray-600 text-sm'>Last changed by Peter Hatch · 1 minute ago</p>
            <p className='text-gray-800'>
              Looking for something both cozy and stylish to lounge around in? Look no further than our Jayne Knit Short
              PJ Set. This set comes in a beautiful seashell pink color and includes a short-sleeve top with notch
              collar and contrast piping detail, as well as fabric-covered buttons. The shorts are made of a soft knit
              fabric and have an elastic waistband for the perfect fit. This set is perfect for lounging around the
              house or getting a good night's sleep.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
