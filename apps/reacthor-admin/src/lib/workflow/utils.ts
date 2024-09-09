export const isAgent = ['toolAgentComponent', 'chatAgentComponent']

export const SUPERVISOR_GRAPH_ID = 'supervisorGraph' as const
export const PROMPT_ID = 'promptNode' as const

export const getSourceType = (source?: any): string =>
  source?.split('_')[0] ?? ''

export const getGraphInfo = (source: string, target: string) => {
  const isSupervisorGraph = getSourceType(source) === SUPERVISOR_GRAPH_ID

  const currentGraphId = isSupervisorGraph ? source : target

  const currentAgent = isSupervisorGraph ? target : source

  const verifyAgentExist = isAgent.includes(getSourceType(currentAgent))
  const verifyGraphExist = getSourceType(currentGraphId) === SUPERVISOR_GRAPH_ID

  return { verifyGraphExist, currentGraphId, currentAgent, verifyAgentExist }
}

export const getAgentInfo = (source: string, target: string) => {
  const verifyAgentExist = isAgent.includes(getSourceType(source))
  const verifyPromptExist =
    getSourceType(source) === PROMPT_ID || getSourceType(target) === PROMPT_ID

  const currentAgent = verifyAgentExist ? source : target
  const currentPrompt = !verifyAgentExist ? source : target

  return { currentPrompt, currentAgent, verifyAgentExist, verifyPromptExist }
}
