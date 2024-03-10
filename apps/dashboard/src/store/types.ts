export type AtomWithMutationReturn = {
  status: 'fulfilled' | 'rejected'
  result: unknown
  error?: unknown
}

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  CREATE_ORGANIZATION_ERROR: 'Create organization error',
  BRAND_VOICE_MISSING_FIELDS: 'Missing branding params or field',
  DELETED_PRODUCT_ERROR: 'Issue in deleted product',
  IMAGE_RESULT_ERROR: 'Issue with the image result'
} as const
