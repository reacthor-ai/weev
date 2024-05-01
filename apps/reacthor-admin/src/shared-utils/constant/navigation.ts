export const NAVIGATION = {
  HOME: '/',
  PROJECTS: '/dashboard/projects',
  SETTINGS: '/dashboard/settings',
  DATA_STORE: {
    HOME: '/dashboard/dataset',
    LIST: '/dashboard/dataset/{id}/list'
  },
  FINE_TUNE: '/dashboard/fine-tune',
  PLAYGROUND: '/dashboard/playground'
} as const satisfies Record<string, string | Record<string, string>>

export const REACTHOR_API_ROUTES = {
  CREATE_USER: '/dashboard/api/create-user',
  CREATE_DATA_SET: '/dashboard/api/create-dataset',
  GET_DATA_SETS: '/dashboard/api/get-dataset',
  GET_LIST_FINE_TUNE_JOB: '/dashboard/api/get-fine-tune-jobs',
  CREATE_GCP_STORE_RAG: '/dashboard/api/create-gcp-store',
  UPDATE_MESSAGE_BY_ID: '/dashboard/api/update-message-by-id',
  DELETE_MESSAGE_BY_ID: '/dashboard/api/delete-message-by-id',
  DELETE_DATASET_BY_ID: '/dashboard/api/delete-dataset',
  AI: {
    UPDATE_DATA_SET: '/dashboard/api/ai/update-data-set',
    CONVERSATION_AGENT: '/dashboard/api/ai/agent/conversational-agent'
  },
  GCP: {
    STORAGE: {
      UPLOAD_FILE: '/dashboard/api/gcp/storage/upload-many-files'
    },
    FUNCTION: {
      TRIGGER: '/dashboard/api/gcp/functions/trigger-merge-csv'
    }
  }
} as const satisfies Record<string, string | Record<string, unknown>>
