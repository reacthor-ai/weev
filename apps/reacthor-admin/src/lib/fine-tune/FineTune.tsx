'use client'

import { CreateFinetuningJob } from './create/CreateFinetuningJob'
import { useGetListFineTuneJobAtomAtom } from '@/store/fine-tune/list'

export const FineTune = () => {
  const [{ data, isLoading }] = useGetListFineTuneJobAtomAtom()
  return (
    <div className={'overflow-auto h-screen'}>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl">Train your model</h1>
        <CreateFinetuningJob />
      </div>

      <div className='mt-8'>
        {
          isLoading ? <>Loading...</> : (
            <>
            {data && data.status === 'fulfilled' ? (<>

              {
                data?.result?.data?.map((fineTune) => {
                  return <div key={fineTune.id}>{fineTune.title}</div>
                })
              }
            </>) : (<>Nothing yet...</>)}
            </>
          )
        }
      </div>
    </div>
  )
}