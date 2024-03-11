import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type ProgressProps = {
  newProduct: () => void
  isDisabled: () => boolean
  brandVoiceId: string
  progress: { value: number, title: string }
}

export function GenerateProgressBar(props: ProgressProps) {
  const { isDisabled, brandVoiceId, newProduct, progress } = props
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isDisabled() || brandVoiceId.length <= 0}
          onClick={newProduct}
          className='bg-blue-600 text-white w-full'>
          Generate content
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generating your image...</AlertDialogTitle>
          <AlertDialogDescription>
            We're currently working on creating your image
            this will only take second...
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className='mb-2'>{progress.title}</p>
        <Progress value={progress.value} />

        <AlertDialogFooter>
          <AlertDialogCancel className={'bg-[red] text-white'}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
