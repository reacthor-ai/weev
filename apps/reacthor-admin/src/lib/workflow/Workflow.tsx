import '@xyflow/react/dist/style.css'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import {
  addEdge,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  NodeChange,
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
import { useWorkflow } from '@/store/workflow/graph/graph'
import {
  getGraphInfo,
  getSourceType,
  isAgent,
  SUPERVISOR_GRAPH_ID
} from '@/lib/workflow/utils'
import { useRemoveAgent } from '@/store/workflow/agents/agents'

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
  const [nodes, setNodes] = useNodesState<any>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
  const { screenToFlowPosition } = useReactFlow()
  const [close, setClose] = useState({
    title: '',
    close: false
  })

  // atoms
  const [type] = useDndAtom()
  const { workflows, addOrUpdateWorkflow, removeWorkflowFromGraph } =
    useWorkflow()

  const removeAgent = useRemoveAgent()

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
    const { currentAgent, currentGraphId } = getGraphInfo(source, target)

    if (
      ['conditionalRouter', 'promptNode', 'internalGeneralTool'].includes(
        getSourceType(currentAgent)
      )
    ) {
      return
    }

    const currentWorkflow = workflows.find(w => w.name === currentGraphId)
    let newConnections: [string, string][]

    if (!currentWorkflow || currentWorkflow.connections!.length === 0) {
      newConnections = [
        ['__start__', currentAgent],
        [currentAgent, '__end__']
      ]
    } else {
      const lastNonEndIndex =
        currentWorkflow.connections!.findIndex(conn => conn[1] === '__end__') -
        1
      newConnections = [
        ...currentWorkflow.connections!.slice(0, lastNonEndIndex + 1),
        [currentWorkflow.connections![lastNonEndIndex]![1], currentAgent],
        [currentAgent, '__end__']
      ]
    }

    addOrUpdateWorkflow(currentGraphId, newConnections)
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
    [nodes, edges]
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

  const onNodeChange = useCallback((changes: any) => {
    const currentChanges = changes[0]
    const type = (currentChanges as NodeChange<any>).type

    if (type === 'remove' && 'id' in currentChanges) {
      const isSupervisorGraph =
        getSourceType(currentChanges.id) === SUPERVISOR_GRAPH_ID

      const isValidAgent = isAgent.includes(getSourceType(currentChanges.id))

      if (isSupervisorGraph) {
        removeWorkflowFromGraph(currentChanges.id)
      }

      if (isValidAgent) {
        removeAgent(currentChanges.id)
      }
    }
    return setNodes(eds => applyNodeChanges(changes, eds))
  }, [])

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
            onNodesChange={onNodeChange}
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
