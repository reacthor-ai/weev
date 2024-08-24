'use client'

import { useParams } from 'next/navigation'
import {
  useGetPromptByIdAtom,
  useUpdatePromptByIdAtom
} from '@/store/prompt/get'
import { PromptForm } from './PromptForm'
import { PromptDisplay } from './PromptDisplay'
import { useCallback, useEffect, useState } from 'react'

export const PromptDetail = () => {
  const { promptId } = useParams()

  const updatePromptByIdAtom = useUpdatePromptByIdAtom()
  const [{ data: promptByIdValue, isPending: isLoadingPromptById }] =
    useGetPromptByIdAtom()

  const [elements, setElements] = useState<any>([])
  const [variables, setVariables] = useState<any>({})

  const addElement = (type: any, value: any) => {
    setElements([...elements, { type, value }])
  }

  const updateVariables = (key: any, value: any) => {
    setVariables({
      ...variables,
      [key]: value
    })
  }

  const updatePromptByIdCallback = useCallback(() => {
    if (promptId && typeof promptId === 'string') {
      updatePromptByIdAtom(promptId)
    }
  }, [promptId, updatePromptByIdAtom])

  useEffect(() => {
    updatePromptByIdCallback()
  }, [updatePromptByIdCallback])

  if (isLoadingPromptById) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div className="relative hidden mb-12 flex-col items-start gap-8 md:flex">
        <h1 className="text-xl font-bold mb-4">Prompt Template Manager</h1>
        <div className="flex w-full">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-100px)] p-4">
            <PromptForm
              addElement={addElement}
              updateVariables={updateVariables}
            />
          </div>
          <div className="flex-1 overflow-y-auto h-[calc(100vh-100px)] p-4">
            <PromptDisplay elements={elements} variables={variables} />
          </div>
        </div>
      </div>
    </div>
  )
}
