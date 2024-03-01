'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { type ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import Image from 'next/image'
import weevLogoSvg from '../../../public/weev-logo.svg'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { Nav } from '@/components/ui/nav'
import { FolderOpenIcon, HomeIcon, PencilIcon, SettingsIcon, SpeakerIcon } from 'lucide-react'

const defaultLayout = [75, 440, 655]

type MenuProps = {
  children?: ReactNode
  childrenWithTabs?: ReactNode
}

export const Menu = (props: MenuProps) => {
  const { children, childrenWithTabs } = props

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        className='h-full items-stretch'>
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsible
        >
          <div style={{ marginRight: '4.5rem' }} className={'flex content-center items-center justify-center'}>
            <Image
              alt='weeev-logo'
              height={50}
              className='block m-auto'
              width={400}
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover'
              }}
              src={weevLogoSvg}
            />
            <div>
              <p>WeeevAI</p>
            </div>
          </div>


          <Nav
            isCollapsed={false}
            links={[
              {
                title: 'Home',
                icon: HomeIcon,
                variant: 'default',
                href: NAVIGATION.HOME
              },
              {
                title: 'Projects',
                icon: FolderOpenIcon,
                variant: 'ghost',
                href: NAVIGATION.PROJECTS
              },
              {
                title: 'Brand Voice',
                icon: SpeakerIcon,
                variant: 'ghost',
                href: NAVIGATION.BRAND_VOICE
              },
              {
                title: 'Content Library',
                icon: PencilIcon,
                variant: 'ghost',
                href: NAVIGATION.CONTENT_LIBRARY
              },
              {
                title: 'Settings',
                icon: SettingsIcon,
                variant: 'ghost',
                href: NAVIGATION.SETTINGS
              }
            ]}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={defaultLayout[1]}>
          {
            childrenWithTabs ? (
              <>{childrenWithTabs}</>
            ) : (
              <div>
                {children}
              </div>
            )
          }
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
