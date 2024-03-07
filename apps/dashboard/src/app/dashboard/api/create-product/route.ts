import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()
  const {
    prompt: {
      text,
      image
    },
    brandVoiceId,
    src
  } = params

  const data = await prisma.product.create({
    data: {
      brandVoiceId,
      image: {
        create: [
          {
            src,
            default: false,
            type: 'PROMPT_IMAGE',
            prompt: {
              create: [
                {
                  text: image, // image prompt
                  type: 'PRODUCT_IMAGE'
                }
              ]
            }
          }
        ]
      },
      status: 'IN_PROGRESS',
      prompt: {
        createMany: {
          data: [
            {
              text, // text prompt
              type: 'PRODUCT_TEXT'
            }
          ]
        }
      }
    },
    include: {
      brandVoice: false
    }
  })

  return Response.json(data)
}
