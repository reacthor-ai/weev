export const getGraphInfo = (source: string, target: string) => {
  const isSupervisorGraph = source === 'supervisorGraph'
  const currentGraphId = isSupervisorGraph ? source : target
  const currentAgent = isSupervisorGraph ? target : source

  return { isSupervisorGraph, currentGraphId, currentAgent }
}

export const getSourceType = (source?: any): string =>
  source?.split('_')[0] ?? ''

export const isAgent = ['toolAgentComponent', 'chatAgentComponent']