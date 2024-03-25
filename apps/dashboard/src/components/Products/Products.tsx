'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FileEditIcon } from 'lucide-react'
import { truncateWords } from '@/shared-utils/text'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { ImageType, ProductType } from '@/database'
import { useDeleteProductByIdAtom } from '@/store/products/deleteProductById'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type ProductsProps = {
  productId: string
  products: ProductType[]
}

export const Products = (props: ProductsProps) => {
  const { products } = props

  const [{ mutate: deleteProductById }] = useDeleteProductByIdAtom()

  const router = useRouter()

  return (
    <div className='grid grid-cols-3 gap-6'>
      {products.map(async product => {
        const linkToEdit = `${NAVIGATION.PROJECT_DETAILS}/edit/${product.id}`
        const src = (product?.image as unknown as ImageType).src
        return (
          <Card key={product.id} className='w-[300px]'>
            <div className='grid gap-2.5 p-4'>
              <Image
                alt={product.title ?? ''}
                className='aspect-square object-cover rounded-lg border border-gray-200 w-full overflow-hidden dark:border-gray-800'
                height={300}
                src={src}
                width={300}
              />
              <div className='flex items-center gap-4'>
                <div className='grid gap-0.5'>
                  <h2 className='text-xl font-bold leading-none'>
                    {product?.title ?? ''}
                  </h2>
                  <p className='text-sm my-2 leading-none'>
                    {truncateWords(20, product?.description ?? '')}
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
                      <Button onClick={() => {

                        return deleteProductById({
                          productId: product.id
                        }, {
                          onSettled: () => {
                            return router.refresh()
                          }
                        })
                      }}>Yes, Delete</Button>
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
