'use client'

import { Loader2, PenBoxIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  updateProjectPromptsByIdAtom,
  useGetProjectPromptsByAtom
} from '@/store/prompt/list'
import { useCreatePromptsAtom } from '@/store/prompt/create'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export const ListPrompts = () => {
  const [promptTitle, setPromptTitle] = useState('')
  const router = useRouter()
  const { id: projectId } = useParams()

  const [promptId, updateProjectPromptsById] = updateProjectPromptsByIdAtom()
  const [{ mutate: createPromptAtom, isPending: isLoadingCreatePrompt }] =
    useCreatePromptsAtom()

  const [{ data: prompts, isPending: isLoadingPrompts }] =
    useGetProjectPromptsByAtom()

  const updatePrompts = useCallback(() => {
    if (projectId && typeof projectId === 'string') {
      updateProjectPromptsById(projectId)
    }
  }, [projectId, updateProjectPromptsById])

  useEffect(() => {
    updatePrompts()
  }, [updatePrompts, promptId, prompts])

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-2xl">Prompts List</h2>
        </div>
        <Dialog>
          <DialogTrigger>Create Prompt +</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Prompt</DialogTitle>
              <br />
              <DialogDescription>
                <div>
                  <Input
                    placeholder="Please enter your prompt name"
                    onChange={e => setPromptTitle(e.target.value)}
                  />
                </div>
                <br />
                <Button
                  disabled={promptTitle.length === 0}
                  onClick={() => {
                    return createPromptAtom(
                      {
                        title: promptTitle,
                        projectId: projectId as string
                      },
                      {
                        onSettled: () => {
                          return window.location.reload()
                        }
                      }
                    )
                  }}
                  className="bg-white text-black hover:bg-black hover:text-white"
                >
                  {isLoadingCreatePrompt ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Prompt
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <br />
      {isLoadingPrompts ? (
        <p>Loading...</p>
      ) : (
        <div className="flex-row flex">
          {!!prompts?.result.data?.length ? (
            prompts?.result.data?.map(prompt => {
              return (
                <div
                  onClick={() =>
                    router.push(
                      NAVIGATION.DASHBOARD_PROJECT.PROMPTS.DETAIL.replace(
                        '{projectId}',
                        projectId as string
                      ).replace('{promptId}', prompt.id)
                    )
                  }
                  key={prompt.id}
                  className="w-[30%] mr-5"
                >
                  <div className="rounded-xl border bg-[#17171c] text-white text-card-foreground group mb-4 flex h-20 cursor-pointer items-center gap-x-3 p-4 ring-primary transition-all hover:ring-2">
                    <PenBoxIcon />
                    <div className="flex-1 font-medium">{prompt.title}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-4 w-4 opacity-70"
                    >
                      <path d="M18 8L22 12L18 16"></path>
                      <path d="M2 12H22"></path>
                    </svg>
                  </div>
                </div>
              )
            })
          ) : (
            <p>Nothing yet...</p>
          )}
        </div>
      )}
    </div>
  )
}
