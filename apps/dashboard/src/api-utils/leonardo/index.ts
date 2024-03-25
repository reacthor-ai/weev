import { Leonardo } from '@leonardo-ai/sdk'

export const imageModelSdk = new Leonardo({
  bearerAuth: process.env.LEONARDO_API_KEY!
})