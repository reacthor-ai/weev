'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import reacthorLogo from '../../../public/weev-logo.svg'
import logo1 from '../../../public/industry-logo/2c2p_logo.jpeg'
import logo2 from '../../../public/industry-logo/brikl_logo.jpeg'
import logo3 from '../../../public/industry-logo/kavxcorp_logo.jpeg'
import logo4 from '../../../public/industry-logo/listenfield_logo.jpeg'
import logo5 from '../../../public/industry-logo/reisedigital_logo.jpeg'
import logo6 from '../../../public/industry-logo/agoda_logo.jpeg'

import Image from 'next/image'
import Features from '@/libs/HomePage/features'

const images = [logo1, logo2, logo3, logo4, logo5, logo6]

export default function HomePageV1() {
  return (
    <>
      <div key="1" className="bg-black text-white">
        <nav className="flex justify-between items-center">
          <div className={'flex items-center'}>
            <Image
              src={reacthorLogo}
              alt={'reacthor-logo'}
              width={80}
              height={80}
            />
            <h1 className="text-xl font-bold">Reacthor AI.</h1>
          </div>
        </nav>

        <header className="flex flex-col items-center justify-center text-center">
          <div className="bg-[#0e0e0e] text-[#f6f6f6] p-8 rounded-lg text-center">
            <h1 className="font-bold text-8xl leading-none">
              WHERE AI STARTUPS
              <br />
              AND BUSINESSES
              <br />
              ARE BUILT
            </h1>
            <div className="flex -space-x-14 mb-10 justify-center">
              <Avatar>
                <AvatarImage
                  alt="Avatar"
                  src="/placeholder.svg?height=120&width=120"
                />
              </Avatar>
              <Avatar>
                <AvatarImage
                  alt="Avatar"
                  src="/placeholder.svg?height=120&width=120"
                />
              </Avatar>
            </div>
            <p className="max-w-lg mb-8 mx-auto text-[#888]">
              🇺🇸 American developers based in APAC covering (Singapore,
              Thailand, Indonesia, Australia, and Malaysia) helping both large
              and small companies integrate new Generative AI tools into their
              existing systems or develop new ones.
            </p>
          </div>
          <div className="flex space-x-4 mt-8">
            <Button
              onClick={() => {
                return window.open('https://cal.com/reacthor-ai')
              }}
              className="mb-8"
              variant="secondary"
            >
              <ArrowUpRightIcon className="mr-2" />
              LET&apos;S TALK
            </Button>
          </div>
        </header>

        {/*trusted by*/}
        <div>
          <header className="flex flex-col pb-8 items-center justify-center text-center">
            <div className="bg-[#0e0e0e] text-[#f6f6f6] p-8 rounded-lg text-center">
              <p className="mb-3">Our Credentials</p>
              <div className={'flex'}>
                {images.map((image, key) => {
                  return (
                    <Image
                      key={key}
                      className="pr-4 rounded-full"
                      src={image}
                      width={75}
                      height={75}
                      alt={'logo'}
                    />
                  )
                })}
              </div>
            </div>
          </header>
        </div>

        {/* WHAT WE DO */}
        <Features />
      </div>
    </>
  )
}

function ArrowUpRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}
