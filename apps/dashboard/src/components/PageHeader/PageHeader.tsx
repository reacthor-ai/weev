import { Separator } from '@/components/ui/separator'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

type PageHeaderProps = {
  title: string
  subTitle: string
  content: string
  children: ReactNode
  btnTitle?: string
  btnLink?: string
  enableBackBtn?: boolean
}

export const PageHeader = (props: PageHeaderProps) => {
  const {
    title,
    subTitle,
    content,
    children,
    btnTitle,
    btnLink,
    enableBackBtn
  } = props
  return (
    <div className='h-screen'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div className='flex flex-row items-center'>
          <div className='ml-4'>
            <h1 className='text-2xl'>{title}</h1>
          </div>
        </div>

        {btnTitle && btnLink && (
          <Link href={btnLink}>
            <Button>
              <PlusCircledIcon className='h-4 w-4 mr-2' />
              {btnTitle}
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      <div className='overflow-auto h-screen'>
        <div className='mx-8 mt-8'>
          <h2 className='text-2xl'>{subTitle}</h2>
          <p className='text-gray-500 mt-2'>{content}</p>

          <div className='mt-5'>{children}</div>
        </div>
      </div>
    </div>
  )
}
