import { redirect } from 'next/navigation'
import Link from 'next/link'


export default function Homev2() {
  return (
    <div className="h-[100vh] min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#080A10] via-[#0C101A] to-[#101525] text-white font-sans from-40% via-50%">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-gray-700 bg-opacity-50 text-sm">
            BETA
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            reac<i>thor</i>.
          </h1>
          <div>
            <p>
              .freelance <i>gamified</i>.
            </p>
            <br />
            <p className="mb-2">
              Publish a task. Find your opponent. Compete for your{' '}
              <strong>bid</strong>.
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <Link className='text-red-800' href={'https://play.reacthor.com'}><i>try?</i></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
