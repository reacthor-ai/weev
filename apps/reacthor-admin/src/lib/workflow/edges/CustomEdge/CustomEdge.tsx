import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow
} from '@xyflow/react'
import { getGraphInfo } from '@/lib/workflow/utils'
import { useWorkflow } from '@/store/workflow/graph/graph'

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd
}: EdgeProps) {
  const { setEdges, getEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const { removeWorkflowConnection } = useWorkflow()

  const removeExclusiveConnections = (source: string, target: string) => {
    const { currentAgent, currentGraphId, verifyAgentExist, verifyGraphExist } =
      getGraphInfo(source, target)

    // don't run if it's there is no agent and graph in the source or target
    if (!verifyAgentExist && !verifyGraphExist) return

    return removeWorkflowConnection(currentAgent, currentGraphId)
  }

  const onEdgeClick = () => {
    setEdges(edges =>
      edges.filter(({ source, target, id: edgeId }) => {
        console.log({ id })
        // remove: graph connections
        removeExclusiveConnections(source, target)

        return edgeId !== id
      })
    )
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton" onClick={onEdgeClick}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
