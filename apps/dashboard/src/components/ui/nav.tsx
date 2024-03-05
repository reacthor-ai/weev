'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from './button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { usePathname } from 'next/navigation'

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
    href: string
  }[]
}

export function Nav(props: NavProps) {
  const { links, isCollapsed } = props

  const pathname = usePathname()

  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <div className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map((link) =>
          isCollapsed ? (
            <Tooltip key={link.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'icon' }),
                    'h-9 w-9',
                    link.href === pathname &&
                    'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-dark bg-[#e11d48]'
                  )}
                >
                  <link.icon className='h-4 w-4' />
                  <span className='sr-only'>{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right' className='flex items-center gap-4'>
                {link.title}
                {link.label && <span className='ml-auto'>{link.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                buttonVariants({
                  variant: link.href === pathname ? 'default' : 'ghost',
                  size: 'sm'
                }),
                link.href === pathname &&
                'dark:bg-muted dark:text-dark dark:hover:bg-muted dark:hover:text-dark',
                'justify-start'
              )}
            >
              <link.icon className='mr-2 h-4 w-4' />
              {link.title}
            </Link>
          )
        )}
      </div>
    </div>
  )
}
