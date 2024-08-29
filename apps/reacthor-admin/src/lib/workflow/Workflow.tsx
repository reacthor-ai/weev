import '@xyflow/react/dist/style.css'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import {
  addEdge,
  Background,
  type Connection,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react'
import { TopHeader } from '@/lib/workflow/TopHeader/TopHeader'
import { WorkflowContainer } from './WorkflowMenu'
import {
  BlocksIcon,
  BookDashedIcon,
  BotIcon,
  DatabaseIcon,
  HammerIcon,
  MessageCircleIcon,
  NetworkIcon,
  RouteIcon,
  SatelliteDishIcon,
  ZapIcon
} from 'lucide-react'
import { WorkflowNavigation } from '@/lib/workflow/WorkflowMenu'
import { Separator } from '@/components/ui/separator'
import {
  WorkflowAgentsComponents,
  WorkflowConditionalRouter,
  WorkflowGraphsComponents,
  WorkflowPromptsComponents,
  WorkflowToolsComponents
} from '@/lib/workflow/WorkflowMenu/Container/Components/Components'
import { GenericPromptNode } from '@/lib/workflow/nodes/prompts/GenericPrompt'
import { InternalGeneralTool } from '@/lib/workflow/nodes/tools/InternalGeneralTool'
import { ChatAgentComponent } from '@/lib/workflow/nodes/agents/ChatAgentComponent/ChatAgentComponent'
import { InitialState } from '@/lib/workflow/State'
import { MemoryConfiguration } from '@/lib/workflow/Memory'
import { ConditionalRouter } from './nodes/router/ConditionalRouter'
import { useDndAtom } from '@/store/dnd/create'
import { CustomEdge } from '@/lib/workflow/edges/CustomEdge'
import { getId } from '@/utils/getId'
import { SupervisorGraph } from '@/lib/workflow/nodes/graph/SupervisorGraph'
import {
  useSetUpdateWorkflowAtom,
  useValueWorkflowAtom,
  WorkflowAtomParams
} from '@/store/workflow/graph/graph'
import { useAgents } from '@/store/workflow/agents/agents'
import { getGraphInfo, getSourceType } from '@/lib/workflow/utils'

const connectionLineStyle = { stroke: 'white' }
const snapGrid: [number, number] = [20, 20]

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const nodeTypes = {
  promptNode: GenericPromptNode,
  internalGeneralTool: InternalGeneralTool,
  chatAgentComponent: (props: any) => (
    <ChatAgentComponent {...props} type="general" />
  ),
  toolAgentComponent: (props: any) => (
    <ChatAgentComponent {...props} type="tools" />
  ),
  conditionalRouter: ConditionalRouter,
  supervisorGraph: SupervisorGraph
}

const edgeTypes = {
  default: CustomEdge
}

const connectionRestrictions = {
  prompt: ['tool', 'agentgraph', 'condition'],
  tool: ['prompt', 'agentgraph', 'condition'],
  agentgraph: ['tool', 'prompt', 'condition'],
  condition: ['prompt', 'tool', 'agentgraph'],
  graph: ['tool', 'prompt']
}

const transitionComponent = {
  Graphs: <WorkflowGraphsComponents />,
  Agents: <WorkflowAgentsComponents />,
  Prompts: <WorkflowPromptsComponents />,
  Tools: <WorkflowToolsComponents />,
  'Conditional Router': <WorkflowConditionalRouter />,
  State: <InitialState />,
  Memory: <MemoryConfiguration />
} as Record<string, ReactNode>

export const FlowProvider = () => {
  return (
    <ReactFlowProvider>
      <Workflow />
    </ReactFlowProvider>
  )
}

export const Workflow = () => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
  const { screenToFlowPosition } = useReactFlow()
  const [close, setClose] = useState({
    title: '',
    close: false
  })

  // atoms
  const [type] = useDndAtom()
  const workflow = useValueWorkflowAtom()
  const setWorkflowGraph = useSetUpdateWorkflowAtom()
  const agents = useAgents()

  const isConnectionRestricted = (
    source: string | null,
    target: string | null
  ) => {
    if (!source) return false
    const sourceType = getSourceType(source)
    const targetType = getSourceType(target)

    return (connectionRestrictions as any)[sourceType]?.includes(targetType)
  }

  const updateWorkflowGraph = (source: string, target: string) => {
    if (!workflow || workflow.length <= 0) return

    const { currentAgent, currentGraphId } = getGraphInfo(source, target)
    const currentWorkflow = workflow.find(
      ({ name: id }) => id === currentGraphId
    )

    if (
      !currentWorkflow ||
      ['conditionalRouter', 'promptNode', 'internalGeneralTool'].includes(
        getSourceType(currentAgent)
      )
    ) {
      return
    }
    const updateWorkflowGraph = (source: string, target: string) => {
      if (!workflow || workflow.length <= 0) return

      const { currentAgent, currentGraphId } = getGraphInfo(source, target)
      const currentWorkflow = workflow.find(
        ({ name: id }) => id === currentGraphId
      )

      if (
        !currentWorkflow ||
        ['conditionalRouter', 'promptNode', 'internalGeneralTool'].includes(
          getSourceType(currentAgent)
        )
      ) {
        return
      }

      const updatedWorkflow: WorkflowAtomParams = {
        name: currentWorkflow.name,
        connections: []
      }

      if (
        !currentWorkflow.connections ||
        currentWorkflow.connections.length === 0
      ) {
        // If there are no existing connections, create a simple workflow
        updatedWorkflow.connections = [
          ['__start__', currentAgent],
          [currentAgent, '__end__']
        ]
      } else {
        // If there are existing connections, insert the new agent before __end__
        const lastConnection =
          currentWorkflow.connections[currentWorkflow.connections.length - 1]

        updatedWorkflow.connections = [
          ...currentWorkflow.connections.slice(0, -1),
          [lastConnection![0], currentAgent],
          [currentAgent, '__end__']
        ]
      }

      console.log({ updatedWorkflow })
      setWorkflowGraph(updatedWorkflow)
    }
  }

  const onConnect = useCallback(
    (params: Connection) => {
      const { sourceHandle, targetHandle, source, target } = params

      if (isConnectionRestricted(sourceHandle, targetHandle)) {
        console.warn(`Connections ${sourceHandle} and ${targetHandle}`)
        return
      }

      const sourceSplit = getSourceType(source)
      const targetSplit = getSourceType(target)

      const isWorkflowValid =
        sourceSplit === 'supervisorGraph' ||
        targetSplit === 'supervisorGraph' ||
        targetSplit === 'chatAgentComponent' ||
        targetSplit === 'toolAgentComponent' ||
        sourceSplit === 'chatAgentComponent' ||
        sourceSplit === 'toolAgentComponent'

      if (isWorkflowValid) {
        updateWorkflowGraph(source, target)
      }

      setEdges(eds => addEdge(params, eds))
    },
    [nodes]
  )

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      if (!type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })
      const newNode = {
        id: getId(type),
        type,
        position,
        data: { label: `${type} node` }
      }

      setNodes(nds => nds.concat(newNode))
    },
    [screenToFlowPosition, type]
  )
  console.log({ workflow, edges, agents })
  return (
    <>
      <TopHeader title="Customer support workflow" />
      <div className="flex h-screen relative">
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
              { title: 'Agents', icon: BotIcon, variant: 'ghost', href: '' },
              {
                title: 'Prompts',
                icon: BookDashedIcon,
                variant: 'ghost',
                href: ''
              },
              { title: 'Tools', icon: HammerIcon, variant: 'ghost', href: '' },
              {
                title: 'Conditional Router',
                icon: RouteIcon,
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
                title: 'Integration',
                icon: BlocksIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Api Routes',
                icon: ZapIcon,
                variant: 'ghost',
                href: ''
              },
              {
                title: 'Chat testing',
                icon: MessageCircleIcon,
                variant: 'ghost',
                href: ''
              }
            ]}
          />
        </div>
        {close.close && (
          <div
            className={`bg-[#17171c] ${close.title === 'State' ? 'w-[700px]' : 'w-1/6'}`}
          >
            {!!close.title && (
              <WorkflowContainer title={close.title} setClose={setClose}>
                {transitionComponent[close.title]}
              </WorkflowContainer>
            )}
          </div>
        )}
        <Separator orientation="vertical" />
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            style={{ background: '#17171c', height: '100%' }}
            nodeTypes={nodeTypes as any}
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
