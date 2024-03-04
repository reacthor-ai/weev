import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { FileEditIcon } from 'lucide-react'
import { truncateWords } from '@/shared-utils/text'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

const products = [
  {
    id: '821e4bb1-dabf-4595-82d5-dcee4e1677a5',
    image:
      'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/4cfe9579-6a35-4aa4-888b-8e45bc551392/Default_Photorealisticthe_Electrolux_UltraQuiet_EcoWash_contro_0.jpg',
    title: 'ElectroLux Washing Machine ECO',
    description:
      'Photorealistic,a washing machine. Subtly incorporate the washing machine in a realistic beautiful kitchen in the background, out of focus, suggesting eco-conscious choices.'
  },
  {
    id: '821e4bb1-dabf-42595-82d5-dcee4e1677a4',
    image:
      'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/4cfe9579-6a35-4aa4-888b-8e45bc551392/Default_Photorealisticthe_Electrolux_UltraQuiet_EcoWash_contro_0.jpg',
    title: 'ElectroLux Washing Machine ECO',
    description:
      'Photorealistic,a washing machine. Subtly incorporate the washing machine in a realistic beautiful kitchen in the background, out of focus, suggesting eco-conscious choices.'
  },
  {
    id: '821e4bb1-dabf-4595-82d5-dce24e1677a5',
    image:
      'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/4cfe9579-6a35-4aa4-888b-8e45bc551392/Default_Photorealisticthe_Electrolux_UltraQuiet_EcoWash_contro_0.jpg',
    title: 'ElectroLux Washing Machine ECO',
    description:
      'Photorealistic,a washing machine. Subtly incorporate the washing machine in a realistic beautiful kitchen in the background, out of focus, suggesting eco-conscious choices.'
  },
  {
    id: '821e4bb1-dabf-4595-82d5-dcee23e1677a5',
    image:
      'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/4cfe9579-6a35-4aa4-888b-8e45bc551392/Default_Photorealisticthe_Electrolux_UltraQuiet_EcoWash_contro_0.jpg',
    title: 'ElectroLux Washing Machine ECO',
    description:
      'Photorealistic,a washing machine. Subtly incorporate the washing machine in a realistic beautiful kitchen in the background, out of focus, suggesting eco-conscious choices.'
  }
]

type ProductsProps = {
  productId: string
}

export const Products = (props: ProductsProps) => {
  const { productId } = props
  return (
    <div className='grid grid-cols-3 gap-6'>
      {products.map(product => {
        const linkToEdit = `${NAVIGATION.PROJECT_DETAILS}/edit/${productId}`
        return (
          <Card className='w-[300px]'>
            <div className='grid gap-2.5 p-4'>
              <div className='block m-0'>
                <Badge
                  className='text-center rounded-full w-[100%] px-2 py-1 text-xs font-semibold uppercase text-blue-800 bg-blue-200'
                  variant='secondary'
                >
                  Ready
                </Badge>
              </div>
              <Image
                alt='Product Image'
                className='aspect-square object-cover rounded-lg border border-gray-200 w-full overflow-hidden dark:border-gray-800'
                height={300}
                src={product.image}
                width={300}
              />
              <div className='flex items-center gap-4'>
                <div className='grid gap-0.5'>
                  <h2 className='text-xl font-bold leading-none'>
                    {product.title}
                  </h2>
                  <p className='text-sm my-2 leading-none'>
                    {truncateWords(100, product.description)}
                  </p>
                </div>
              </div>
            </div>
            <div className='border-t border-gray-200 dark:border-gray-800' />
            <div className='flex items-center justify-between p-4'>
              <Link
                className='text-sm font-medium ml-4 flex items-center'
                href={linkToEdit}
              >
                <FileEditIcon className='w-4 h-4 mr-2' />
                Edit
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline'>Delete</Button>
                </PopoverTrigger>
                <PopoverContent className='w-40 flex items-center justify-center text-center'>
                  <div className='grid gap-4'>
                    <div className='space-y-4'>
                      <p className='font-medium leading-none'>Are you sure?</p>
                      <Button>Yes, Delete</Button>
                    </div>
                    <div className='grid gap-2'></div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
