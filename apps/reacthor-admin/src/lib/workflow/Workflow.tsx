import '@xyflow/react/dist/style.css'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react'
import { TopHeader } from '@/lib/workflow/TopHeader/TopHeader'
import { WorkflowContainer } from './WorkflowMenu'
import {
  BookDashedIcon,
  BotIcon,
  CircleFadingPlusIcon,
  DatabaseIcon,
  HammerIcon, NetworkIcon,
  SatelliteDishIcon,
  SettingsIcon
} from 'lucide-react'
import { WorkflowNavigation } from '@/lib/workflow/WorkflowMenu'
import { Separator } from '@/components/ui/separator'
import {
  WorkflowAgentsComponents,
  WorkflowGraphsComponents,
  WorkflowPromptsComponents,
  WorkflowToolsComponents
} from '@/lib/workflow/WorkflowMenu/Container/Components/Components'
import { GenericPromptNode } from '@/lib/workflow/nodes/prompts/GenericPrompt'

const initBgColor = '#27272a'

const connectionLineStyle = { stroke: 'white' }
const snapGrid: [number, number] = [20, 20]

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const nodeTypes = {
  promptNode: GenericPromptNode
}

export const Workflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])

  const [close, setClose] = useState({
    title: '',
    close: false
  })

  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'promptNode',
        data: {
          label: 'General Prompt Node',
          messages: [
            {
              role: 'system',
              content: 'You are {agent_name}, a customer support specialist...'
            }
          ],
          onAddRole: () => {},
          onRoleChange: (index: number, value: string) => {},
          onContentChange: (index: number, value: string) => {},
          onDeleteRole: (index: number) => {}
        },
        position: { x: 300, y: 50 }
      }
    ])

    setEdges([{}])
  }, [])

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds: any) =>
        addEdge(
          { ...params, animated: true, style: { stroke: initBgColor } },
          eds
        )
      ),
    []
  )

  const transitionComponent = {
    Graphs: <WorkflowGraphsComponents />,
    Agents: <WorkflowAgentsComponents />,
    Prompts: <WorkflowPromptsComponents />,
    Tools: <WorkflowToolsComponents />,
    State: <>State</>,
    Memory: <>hello</>,
    Settings: <>hello</>
  } as Record<string, ReactNode>
  return (
    <>
      <TopHeader title="Customer support workflow" />
      <div className="flex h-screen relative">
        {/* Navigation Panel */}
        <div>
          <WorkflowNavigation
            title={close.title}
            setClose={setClose}
            links={[
              {
                title: 'Graphs',
                icon: NetworkIcon,
                variant: 'default',
                href: ''
              },
              {
                title: 'Agents',
                icon: BotIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Prompts',
                icon: BookDashedIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Tools',
                icon: HammerIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'State',
                icon: SatelliteDishIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Memory',
                icon: DatabaseIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Settings',
                icon: SettingsIcon,
                variant: 'ghost',
                href: ''
              }
            ]}
          />
        </div>
        {/* Component Section */}
        {close.close && (
          <div className="w-1/6 bg-[#17171c]">
            {!!close.title && (
              <WorkflowContainer title={close.title} setClose={setClose}>
                {transitionComponent[close.title]}
              </WorkflowContainer>
            )}
          </div>
        )}
        <Separator orientation="vertical" />
        {/* Workflow Builder */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            style={{ background: '#17171c', height: '100%' }}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultViewport={defaultViewport}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  )
}
