import { reacthorDbClient, ReacthorFinetuneJob } from '@/db'
import { getUser } from '@/db/user'

export type ReturnGetListFineTune = ReacthorFinetuneJob

export const listFinetune = async () => {
  try {
    const user = await getUser()

    if (user && user.organizationId) {
      const result = await reacthorDbClient.finetuneJob.findMany({
        where: {
          organizationId: user.organizationId
        }
      })

      return {
        success: true,
        data: result,
        error: null
      }
    }

    return {
      success: false,
      data: null,
      error: 'NO USER'
    }
  } catch (error) {
    return {
      success: true,
      data: null,
      error
    }
  }
}
