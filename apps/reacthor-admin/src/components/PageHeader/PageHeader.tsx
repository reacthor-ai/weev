import { Separator } from '@/components/ui/separator'
import { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  children: ReactNode
}

export const PageHeader = (props: PageHeaderProps) => {
  const { title, children } = props
  return (
    <div className="h-screen">
      <div className="flex items-center justify-between px-6 py-2.5">
        <div className="flex flex-row items-center">
          <div>
            <h1 className="text-2xl">{title}</h1>
          </div>
        </div>
      </div>
      <Separator />

      <div className="overflow-auto h-screen">
        <div className="mx-6 mt-8">
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
