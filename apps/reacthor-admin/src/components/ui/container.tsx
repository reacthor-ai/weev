import * as React from 'react'
import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface ContainerProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: ReactNode
  type?: 'default' | 'app-container' | 'account'
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, type = 'default', ...props }, ref) => {

    const styles = {
      'default': 'bg-[#000000] h-screen text-white',
      'app-container': 'mx-6 mt-4 h-screen scroll-smooth focus:scroll-auto overflow-auto',
      'account': ''
    } as Record<NonNullable<ContainerProps['type']>, string>

    return (
      <div
        className={cn(
          styles[type],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Container.displayName = 'Container'

export { Container }
