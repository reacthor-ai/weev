'use client'

import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ReactNode } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { XIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const defaultLayout = [20, 540, 755]

type WorkflowComponentContainerProps = {
  children: ReactNode
  title: string
  setClose: Dispatch<SetStateAction<{ title: string; close: boolean }>>
}

export const WorkflowContainer = (props: WorkflowComponentContainerProps) => {
  const { children, title, setClose } = props
  return (
    <div className="w-[100%]">
      <div className="overflow-hidden flex justify-between p-2 align-middle">
        <div>
          <p>{title}</p>
        </div>
        <XIcon
          onClick={() => setClose({ title: '', close: false })}
          className="cursor-pointer"
          color={'#808080'}
        />
      </div>
      <Separator />
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[100%] items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsible
            minSize={20}
            collapsedSize={6}
            maxSize={60}
            className="w-[500px] p-4"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}
