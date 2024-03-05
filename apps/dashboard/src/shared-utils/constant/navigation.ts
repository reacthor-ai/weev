export const NAVIGATION = {
  HOME: '/dashboard',
  PROJECTS: '/dashboard/projects',
  ORGANIZATION: '/dashboard/organization',
  BRAND_IDENTITY_CREATE: '/dashboard/projects/details/create',
  PROJECT_DETAILS: '/dashboard/projects/details',
  PROJECT_DETAILS_PRODUCT: '/dashboard/projects/details/create-product',
  PROJECT_DETAILS_CREATE: '/dashboard/projects/details/create',
  PROJECT_DETAILS_CREATE_IMAGE: '/dashboard/projects/details/edit/create-image',
  SETTINGS: '/dashboard/settings',
  BRAND_VOICE: '/dashboard/brand-voice',
  BRAND_VOICE_CREATE: '/dashboard/brand-voice/create',
  CONTENT_LIBRARY: '/dashboard/content-library',
  CHAT: '/dashboard/chat',
  CONTENT_LIBRARY_PRODUCTS: '/dashboard/content-library/products',
  CONTENT_LIBRARY_PHOTO: '/dashboard/content-library/photo',
  CONTENT_LIBRARY_PROMPTS: '/dashboard/content-library/prompts'
} as const satisfies Record<string, string>