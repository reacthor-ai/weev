'use client'

import { useRouter } from 'next/navigation'

export const Footer = () => {
  const router = useRouter()
  return (
    <div className="mx-4">
      <header className="flex flex-col pb-8 items-center justify-center text-center">
        <div className="bg-[#0e0e0e] text-[#f6f6f6] p-8 rounded-lg text-center">
          <ul className="flex align-middle justify-between">
            <li className="pr-3">Contact Us</li>
            <li
              className={'cursor-pointer'}
              onClick={() => router.push('/privacy')}
            >
              Privacy Policy
            </li>
          </ul>
        </div>
      </header>
    </div>
  )
}
