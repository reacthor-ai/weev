import AssetsList from '@/lib/dataset/upload-box/Assets'
import { UploadIcon } from 'lucide-react'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'

type UploadBoxProps = {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function UploadBox(props: UploadBoxProps) {
  const { files, setFiles } = props
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleTriggerFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileId))
  }

  return (
    <div>
      <div className="col-span-full">
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
          <div className="text-center">
            <UploadIcon
              className="mx-auto h-12 w-12 text-gray-500"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-400">
              <label
                onClick={handleTriggerFileInputClick}
                className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: 'none' }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-400">
              CSV, PDF, TXT up to 10MB
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 &&
        files.map(d => {
          return (
            <div key={d.name} className={'flex flex-row'}>
              <AssetsList
                onDelete={() => handleRemoveFile(d.name)}
                title={d.name.slice(0, 9)}
              />
            </div>
          )
        })}
    </div>
  )
}
