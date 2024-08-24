'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { type ReactNode, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Settings, WorkflowIcon } from 'lucide-react'
import { Nav } from '@/components/ui/nav'
import { TooltipProvider } from '@/components/ui/tooltip'
import Image from 'next/image'
import reacthorSvg from '../../../public/reacthor.svg'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { useParams, useRouter } from 'next/navigation'

const defaultLayout = [10, 440, 655]

type MenuProps = {
  children?: ReactNode
  childrenWithTabs?: ReactNode
}

export const Menu = (props: MenuProps) => {
  const { children, childrenWithTabs } = props

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)
  const router = useRouter()
  const { id, workflowId } = useParams()

  if (workflowId) return <>{children}</>

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
          className={'min-w-[50px]'}
          onCollapse={() => {
            setIsCollapsed(prevState => !prevState)
          }}
        >
          <div className={'flex h-[52px] items-center justify-center'}>
            <Image
              alt="reacthor-logo"
              height={40}
              className="block m-auto cursor-pointer"
              width={40}
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover'
              }}
              src={reacthorSvg}
              onClick={() => {
                return router.push(NAVIGATION.PROJECTS)
              }}
            />
          </div>
          <Separator />

          <Nav
            isCollapsed={isCollapsed}
            links={[
              // {
              //   title: 'Analytics',
              //   icon: LayoutGrid,
              //   variant: 'default',
              //   href: NAVIGATION.DASHBOARD_PROJECT.HOME.replace(
              //     '{id}',
              //     id as string
              //   )
              // },
              {
                title: 'Workflow',
                icon: WorkflowIcon,
                variant: 'default',
                href: NAVIGATION.DASHBOARD_PROJECT.WORKFLOW.HOME.replace(
                  '{projectId}',
                  id as string
                )
              },
              // {
              //   title: 'Prompts',
              //   icon: NotebookTextIcon,
              //   variant: 'ghost',
              //   href: NAVIGATION.DASHBOARD_PROJECT.PROMPTS.HOME.replace(
              //     '{id}',
              //     id as string
              //   )
              // },
              {
                title: 'Settings',
                icon: Settings,
                variant: 'ghost',
                href: NAVIGATION.DASHBOARD_PROJECT.SETTINGS.replace(
                  '{id}',
                  id as string
                )
              }
            ]}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={defaultLayout[1]}>
          {childrenWithTabs ? <>{childrenWithTabs}</> : <div>{children}</div>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
