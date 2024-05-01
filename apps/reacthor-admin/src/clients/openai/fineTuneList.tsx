import { listFinetune, type ReturnGetListFineTune } from '@/db/fine-tune'
import { openAI } from './'
import { OpenAIFinetuningJobs } from './types'

export type ReturnFinetuneList = ReturnGetListFineTune & {
  jobDetails: OpenAIFinetuningJobs
}

export const fineTuneList = async (): Promise<{ data: ReturnFinetuneList[] }> => {
  try {
    const fineTunes = await listFinetune()

    if (fineTunes.data && fineTunes.data.length >= 1) {
      const jobDetailsPromises = fineTunes.data.map(fineTune =>
        openAI.fineTuning.jobs.retrieve(fineTune.fineTuneJobId ?? '')
      )

      const fineTuneJobs = await Promise.all(jobDetailsPromises)

      const combinedList = fineTunes.data.map((fineTune, index) => ({
        ...fineTune,
        jobDetails: fineTuneJobs[index] ?? null
      }))

      return {
        data: combinedList as unknown as ReturnFinetuneList[]
      }
    } else {
      return {
        data: []
      }
    }
  } catch (error) {
    return {
      data: []
    }
  }
}
