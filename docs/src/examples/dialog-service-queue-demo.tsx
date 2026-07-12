import { Button } from 'shadcn-solid-components/components/button'
import {
  alert,
  confirm,
  DialogServiceHost,
  prompt,
} from 'shadcn-solid-components/hoc/dialog-service'

const DialogServiceQueueDemo = () => {
  return (
    <>
      <DialogServiceHost />
      <Button
        variant="outline"
        onClick={() => {
          void alert({
            title: 'Step 1',
            description: 'Queue started.',
          })

          void confirm({
            title: 'Step 2',
            description: 'Continue the workflow?',
          })

          void prompt({
            title: 'Step 3',
            description: 'Add a short note before finishing.',
          })
        }}
      >
        Trigger queued dialogs
      </Button>
    </>
  )
}

export default DialogServiceQueueDemo
