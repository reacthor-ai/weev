'use client'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Dispatch, SetStateAction } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'

const defaultLayout = [10, 440, 655]

interface NavProps {
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
    href: string
  }[]
  setClose: Dispatch<SetStateAction<{ title: string; close: boolean }>>
  title: string
}

export function WorkflowNavigation(props: NavProps) {
  const { links, title, setClose } = props

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsible
          minSize={15}
          collapsedSize={4}
          maxSize={0}
          className={'min-w-[40px]'}
        >
          <Separator />

          <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
              {links.map((link, index) => (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() =>
                        setClose({ title: link.title, close: true })
                      }
                      className={cn(
                        buttonVariants({ variant: link.variant, size: 'icon' }),
                        'h-9 w-9 cursor-pointer',
                        link.title === title &&
                          'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white bg-[#e11d48]'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="sr-only">{link.title}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {link.title}
                    {link.label && (
                      <span className="ml-auto text-muted-foreground">
                        {link.label}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </ResizablePanel>

        <ResizableHandle />
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
