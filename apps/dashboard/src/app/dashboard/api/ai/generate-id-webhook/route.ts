/**
 * Processing the web-hook here to build the image.
 */
export async function POST(request: Request) {
  try {
    const text = await request.json()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: `, {
      status: 400
    })
  }

  return new Response('Success!', {
    status: 200
  })
}