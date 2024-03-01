import { Separator } from '@/components/ui/separator'
import { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subTitle: string
  content: string
  children: ReactNode
}

export const PageHeader = ({ title, subTitle, content, children }: PageHeaderProps) => {
  return (
    <div>
      <div className='flex items-center px-6 py-4'>
        <h1 className='text-2xl'>{title}</h1>
      </div>
      <Separator />

      <div className='mx-8 mt-8'>
        <h2 className='text-2xl'>{subTitle}</h2>
        <p className='text-gray-500 mt-2'>{content}</p>

        <div className='mt-5'>{children}</div>
      </div>
    </div>
  )
}
