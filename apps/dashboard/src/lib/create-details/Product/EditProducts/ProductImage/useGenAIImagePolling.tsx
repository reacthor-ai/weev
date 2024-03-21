import { useEffect, useRef, useState } from 'react'
import { JobStatus } from '@leonardo-ai/sdk/sdk/models/shared'

export function useGenAiImagePolling(generationId: string | null, interval = 60000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const pollingActiveRef = useRef(false) // Indicates whether polling is actively needed

  useEffect(() => {
    pollingActiveRef.current = true // Activate polling

    const fetchData = async () => {
      if (!generationId) {
        setLoading(false)
        return // Do not fetch if no ID
      }

      try {
        setLoading(true)
        const response = await fetch(`/dashboard/api/ai/get-product-image?id=${generationId}`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'API call failed')

        setData(result)
        setError(null)

        if (result.status === JobStatus.Complete || result.status === JobStatus.Failed) {
          pollingActiveRef.current = false // Deactivate polling if status is Complete or Failed
        }
      } catch (error) {
        console.error('Polling error:', error)
        setError(error)
        pollingActiveRef.current = false // Deactivate polling on error
      } finally {
        setLoading(false)
        if (pollingActiveRef.current) {
          setTimeout(fetchData, interval) // Schedule the next poll if still active
        }
      }
    }

    fetchData() // Initial fetch

    return () => {
      pollingActiveRef.current = false // Ensure polling stops if the component is unmounted
    }
  }, [generationId, interval]) // Depend on generationId and interval to re-initialize polling if they change

  return { data, error, loading }
}