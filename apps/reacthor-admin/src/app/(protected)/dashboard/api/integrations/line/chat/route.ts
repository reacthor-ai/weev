import {
  ClientConfig,
  HTTPFetchError,
  MessageAPIResponseBase,
  messagingApi,
  MiddlewareConfig,
  webhook
} from '@line/bot-sdk'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN as string
}

const client = new messagingApi.MessagingApiClient(clientConfig)

const isTextEvent = (
  event: webhook.MessageEvent
): event is webhook.MessageEvent & {
  message: webhook.TextMessageContent
} => {
  return (
    event.type === 'message' && event.message && event.message.type === 'text'
  )
}

const textEventHandler = async (
  event: webhook.MessageEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (!isTextEvent(event)) return

  await client.replyMessage({
    replyToken: event.replyToken as string,
    messages: [
      {
        type: 'text',
        text: event.message.text
      }
    ]
  })
}

export async function POST(req: Request) {
  const callbackRequest: webhook.CallbackRequest = await req.json()
  const events: webhook.Event[] = callbackRequest.events!

  try {
    const results = await Promise.all(
      events.map(async (event: unknown) => {
        try {
          await textEventHandler(event as unknown as webhook.MessageEvent)
        } catch (err: unknown) {
          if (err instanceof HTTPFetchError) {
            console.error(err.status)
            console.error(err.headers.get('x-line-request-id'))
            console.error(err.body)
          } else if (err instanceof Error) {
            console.error(err)
          }

          // Return an error message.
          return Response.json({
            data: null,
            error: err,
            success: false
          }, { status: 500 })
        }
      })
    )

    return Response.json({
      data: results,
      error: null,
      success: true
    }, { status: 200 })
  } catch (error) {
    return Response.json({
      data: null,
      error: error,
      success: false
    }, { status: 500 })
  }
}
