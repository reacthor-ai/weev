import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()
  const {
    title,
    description,
    prompt: {
      text,
      image
    },
    brandVoiceId,
    src
  } = params

  const data = await prisma.product.create({
    data: {
      title,
      description,
      brandVoiceId,
      image: {
        create: [
          {
            src,
            prompt: {
              create: [
                {
                  text: image,
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
              text,
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
