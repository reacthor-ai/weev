export type ReturnApi<T> = {
  success: boolean
  error: unknown | null
  data: T | null
}