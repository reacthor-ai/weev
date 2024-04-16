'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { type ReactNode, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { DatabaseIcon, LayoutGrid, Settings, ZapIcon } from 'lucide-react'
import { Nav } from '@/components/ui/nav'
import { TooltipProvider } from '@/components/ui/tooltip'
import Image from 'next/image'
import reacthorSvg from '../../../public/reacthor.svg'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

const defaultLayout = [10, 440, 655]

type MenuProps = {
  children?: ReactNode
  childrenWithTabs?: ReactNode
}

export const Menu = (props: MenuProps) => {
  const { children, childrenWithTabs } = props

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

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
              className="block m-auto"
              width={40}
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover'
              }}
              src={reacthorSvg}
            />
          </div>
          <Separator />

          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Projects',
                icon: LayoutGrid,
                variant: 'default',
                href: NAVIGATION.HOME
              },
              {
                title: 'Fine tune',
                icon: ZapIcon,
                variant: 'ghost',
                href: NAVIGATION.FINE_TUNE
              },
              {
                title: 'Dataset',
                icon: DatabaseIcon,
                variant: 'ghost',
                href: NAVIGATION.DATA_STORE.HOME
              },
              {
                title: 'Settings',
                icon: Settings,
                variant: 'ghost',
                href: NAVIGATION.SETTINGS
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
