export const NAVIGATION = {
  HOME: '/dashboard',
  PROJECTS: '/dashboard/projects',
  SETTINGS: '/dashboard/settings',
  BRAND_VOICE: '/dashboard/brand-voice',
  CONTENT_LIBRARY: '/dashboard/content-library',
  CONTENT_LIBRARY_PRODUCTS: '/dashboard/content-library/products',
  CONTENT_LIBRARY_PHOTO: '/dashboard/content-library/photo',
  CONTENT_LIBRARY_PROMPTS: '/dashboard/content-library/prompts'
} as const satisfies Record<string, string>