import { Button } from 'shadcn-solid-components/components/button'
import { alert, DialogServiceHost } from 'shadcn-solid-components/hoc/dialog-service'

const DialogServiceAlertDemo = () => {
  return (
    <>
      <DialogServiceHost />
      <Button
        variant="outline"
        onClick={async () => {
          await alert({
            title: 'Session notice',
            description: 'Your workspace settings were updated successfully.',
          })
        }}
      >
        Open alert
      </Button>
    </>
  )
}

export default DialogServiceAlertDemo
