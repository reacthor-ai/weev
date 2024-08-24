export const NAVIGATION = {
  HOME: '/',
  PROJECTS: '/projects',
  DASHBOARD_PROJECT: {
    HOME: '/{id}/dashboard',
    SETTINGS: '/{id}/dashboard/settings',
    WORKFLOW: {
      HOME: '/{projectId}/dashboard/workflow',
      DETAIL: `/{projectId}/dashboard/workflow/d/{workflowId}`
    },
    PROMPTS: {
      HOME: '/{id}/dashboard/prompts',
      DETAIL: '/{projectId}/dashboard/prompts/detail/{promptId}'
    }
  },
  SETTINGS: '/dashboard/settings',
  PROMPTS: {}
} as const

export const REACTHOR_API_ROUTES = {
  CREATE_USER: '/projects/api/create-user',
  GET_USER_BY_CLERK_ID: '/projects/api/get-organization',
  CREATE_PROJECT: '/projects/api/create-project',
  CREATE_PROMPTS: '/projects/api/create-prompt',
  UPDATE_PROMPT: '/projects/api/update-prompt',
  GET_PROMPT: '/projects/api/get-prompt',
  LIST_PROMPTS: '/projects/api/list-prompts'
} as const satisfies Record<string, string | Record<string, unknown>>
