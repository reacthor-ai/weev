import { atom, useAtomValue, useSetAtom } from 'jotai'

type Source = string
type Target = string

export type Connection = [Source, Target]

export type WorkflowAtomParams = {
  name: string
  connections?: Connection[]
}

export const workflowAtom = atom<WorkflowAtomParams[]>([])

export const updateWorkflowAtom = atom(
  null,
  (
    get,
    set,
    action: { type: 'ADD' | 'UPDATE'; workflow: WorkflowAtomParams }
  ) => {
    const currentWorkflows = get(workflowAtom)

    switch (action.type) {
      case 'ADD':
        set(workflowAtom, [...currentWorkflows, action.workflow])
        break
      case 'UPDATE':
        set(
          workflowAtom,
          currentWorkflows.map(w =>
            w.name === action.workflow.name ? action.workflow : w
          )
        )
        break
    }
  }
)

const removeGraphAtom = atom(null, (get, set, workflowId: string) => {
  const currentWorkflow = get(workflowAtom)
  set(
    workflowAtom,
    currentWorkflow.filter(agent => agent.name !== workflowId)
  )
})

export const useSetUpdateWorkflowAtom = () => useSetAtom(updateWorkflowAtom)
export const useValueWorkflowAtom = () => useAtomValue(workflowAtom)

export const useRemoveWorkflowAtom = () => useSetAtom(removeGraphAtom)

export const useWorkflow = () => {
  const workflows = useValueWorkflowAtom()
  const updateWorkflow = useSetUpdateWorkflowAtom()

  const removeWorkflowId = useRemoveWorkflowAtom()

  const addOrUpdateWorkflow = (name: string, newConnections: Connection[]) => {
    const existingWorkflow = workflows.find(w => w.name === name)

    if (existingWorkflow) {
      updateWorkflow({
        type: 'UPDATE',
        workflow: { name, connections: newConnections }
      })
    } else {
      updateWorkflow({
        type: 'ADD',
        workflow: { name, connections: newConnections }
      })
    }
  }

  const removeWorkflowConnection = (
    currentAgentId: string,
    currentGraphId: string
  ) => {
    const workflow = workflows.find(w => w.name === currentGraphId)
    if (!workflow) return

    const connections = workflow.connections || []

    let newConnections: Connection[] = []
    let skipNext = false

    for (let i = 0; i < connections.length; i++) {
      if (skipNext) {
        skipNext = false
        continue
      }

      const [source, target] = connections[i] as any

      if (source === currentAgentId) {
        // If the current agent is the source, we skip this connection
        // and connect the previous target (if exists) to the current target
        if (newConnections.length > 0) {
          newConnections[newConnections.length - 1]![1] = target
        }
        skipNext = true
      } else if (target === currentAgentId) {
        // If the current agent is the target, we skip this connection
        // The next iteration will handle connecting to the next agent
        skipNext = true
      } else {
        // If the current agent is not involved, we keep the connection as is
        newConnections.push([source, target])
      }
    }

    // Handle the case where the removed agent was at the start or end
    if (newConnections.length === 0) {
      newConnections = []
    } else if (newConnections[0]![0] !== '__start__') {
      newConnections.unshift(['__start__', newConnections[0]![0]])
    } else if (newConnections[newConnections.length - 1]![1] !== '__end__') {
      newConnections.push([
        newConnections[newConnections.length - 1]![1],
        '__end__'
      ])
    }

    updateWorkflow({
      type: 'UPDATE',
      workflow: { name: currentGraphId, connections: newConnections }
    })
  }

  const removeWorkflowFromGraph = (workflowId: string) => {
    return removeWorkflowId(workflowId)
  }

  return {
    workflows,
    addOrUpdateWorkflow,
    removeWorkflowConnection,
    removeWorkflowFromGraph
  }
}
