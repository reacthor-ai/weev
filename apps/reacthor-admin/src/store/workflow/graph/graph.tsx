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
  get => get(workflowAtom),
  (get, set, newWorkflow: WorkflowAtomParams) => {
    const currentWorkflows = get(workflowAtom)

    const index = currentWorkflows.findIndex(
      item => item.name === newWorkflow.name
    )
    if (index !== -1) {
      set(
        workflowAtom,
        currentWorkflows.map((item, i) =>
          i === index
            ? {
                ...item,
                connections: [
                  ...(item.connections || []),
                  ...(newWorkflow.connections || [])
                ]
              }
            : item
        )
      )
    } else {
      set(workflowAtom, [...currentWorkflows, newWorkflow])
    }
  }
)

export const useSetUpdateWorkflowAtom = () => useSetAtom(updateWorkflowAtom)
export const useValueWorkflowAtom = () => useAtomValue(workflowAtom)
