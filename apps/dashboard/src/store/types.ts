export type AtomWithMutationReturn = {
  status: 'fulfilled' | 'rejected'
  result: unknown
  error?: unknown
}

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  CREATE_ORGANIZATION_ERROR: 'Create organization error'
} as const
