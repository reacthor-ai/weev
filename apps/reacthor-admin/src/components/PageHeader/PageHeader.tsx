import { Separator } from '@/components/ui/separator'
import { ReactNode } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

type PageHeaderProps = {
  title: string | string[]
  children: ReactNode
}

export const PageHeader = (props: PageHeaderProps) => {
  const { title, children } = props
  return (
    <div className="h-screen">
      <div className="flex items-center justify-between px-6 py-2.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <p>Reacthor</p>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
