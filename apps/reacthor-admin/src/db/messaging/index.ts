import { reacthorDbClient } from '@/db'

export type UpdateMessageContentByIdParams = {
  messagingId: string
  content: string
}

export const updateMessageContentById = async (
  params: UpdateMessageContentByIdParams
) => {
  const { messagingId, content } = params

  try {
    const result = await reacthorDbClient.messaging.update({
      where: {
        id: messagingId
      },
      data: {
        content
      }
    })

    if (result && result.id) {
      return Response.json({
        success: true,
        data: result,
        error: null
      })
    }

    return Response.json({
      success: true,
      data: null,
      error: "Can't update content by id."
    })
  } catch (error) {
    return Response.json({
      success: false,
      data: null,
      error
    })
  }
}

export type DeleteMessagingByIdParams = Pick<
  UpdateMessageContentByIdParams,
  'messagingId'
>

export const deleteMessagingById = async (
  params: DeleteMessagingByIdParams
) => {
  const { messagingId } = params

  try {
    const result = await reacthorDbClient.messaging.delete({
      where: {
        id: messagingId
      }
    })

    if (result && result.id) {
      return Response.json({
        success: true,
        data: result,
        error: null
      })
    }

    return Response.json({
      success: true,
      data: null,
      error: "Can't update content by id."
    })
  } catch (error) {
    return Response.json({
      success: false,
      data: null,
      error
    })
  }
}
