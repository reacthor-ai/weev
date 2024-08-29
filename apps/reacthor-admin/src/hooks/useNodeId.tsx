import { useCallback, useEffect, useState } from 'react'
import { useSetNodeIdAtom } from '@/store/node/getId'
import { getId } from '@/utils/getId'

export const useNodeId = (id: string) => {
  const setNodeId = useSetNodeIdAtom()

  const generateId = useCallback(() => getId(id), [id])

  const [generatedId] = useState(generateId)

  useEffect(() => {
    setNodeId(generatedId)
  }, [generatedId, setNodeId])

  return generatedId
}
