import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()
  const {
    prompt: {
      text,
      image
    },
    brandVoiceId,
    projectId,
    title,
    description,
    src
  } = params

  const data = await prisma.product.create({
    data: {
      title,
      description,
      projectId,
      brandVoiceId,
      image: {
        create: [
          {
            src,
            default: true,
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
