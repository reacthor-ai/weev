import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type UseListenImageGenerationParams = {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

export type ImageGenerationResult = {
  created_at: string
  model_id: string
  prompt: string
  token_cost: string
  images: ImagesGenerationResult[]
}

type ImagesGenerationResult = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  url: string;
  generationId: string;
  nobgId: null;
  nsfw: boolean;
  likeCount: number;
  trendingScore: number;
  public: boolean;
  motionGIFURL: null;
  motionMP4URL: null;
  teamId: null;
}

export const useListenImageGeneration = (params: UseListenImageGenerationParams) => {
  const { setIsLoading } = params

  const [messages, setMessages] = useState<ImageGenerationResult | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`wss://weeev-ai-silent-shape-2907-lingering-thunder-8760.fly.dev/ws`)

    ws.onmessage = (event) => {
      const message: ImageGenerationResult = JSON.parse(JSON.parse(event.data))
      setIsLoading(false)
      setMessages(message)
    }

    ws.onerror = () => {
      setIsLoading(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  return {
    messages
  }
}