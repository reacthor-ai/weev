import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow
} from '@xyflow/react'
import { useRemoveAgentAtom } from '@/store/workflow/agents/agents'
import { getGraphInfo, getSourceType, isAgent } from '@/lib/workflow/utils'

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

  const edges = getEdges()

  const removeAgentAtom = useRemoveAgentAtom()

  const removeExclusiveAgent = (source: string, target: string) => {
    const { currentAgent: id } = getGraphInfo(source, target)
    if (!isAgent.includes(getSourceType(id))) return
    removeAgentAtom(id)
  }

  const onEdgeClick = () => {
    setEdges(edges =>
      edges.filter(edge => {
        console.log({ edge })
        removeExclusiveAgent(edge.source, edge.target)

        return edge.id !== id
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
