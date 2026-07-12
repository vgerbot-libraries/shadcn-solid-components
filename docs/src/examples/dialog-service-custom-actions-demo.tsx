import { Button } from 'shadcn-solid-components/components/button'
import {
  confirm,
  type DialogActionResult,
  DialogServiceHost,
} from 'shadcn-solid-components/hoc/dialog-service'
import { createSignal } from 'solid-js'

const DialogServiceCustomActionsDemo = () => {
  const [result, setResult] = createSignal<DialogActionResult | null>(null)

  return (
    <>
      <DialogServiceHost />
      <div class="flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={async () => {
            const next = await confirm({
              title: 'Publish article',
              description: 'Choose what to do with your current draft.',
              actions: [
                { actionKey: 'cancel', label: 'Cancel', variant: 'outline' },
                { actionKey: 'save-draft', label: 'Save Draft', variant: 'secondary' },
                { actionKey: 'schedule', label: 'Schedule', variant: 'outline' },
                { actionKey: 'publish', label: 'Publish', variant: 'default', autofocus: true },
              ],
            })
            setResult(next)
          }}
        >
          Open custom actions
        </Button>
        <p class="text-muted-foreground text-sm">
          Last action: {result() ? result()!.actionKey : 'none'}
        </p>
      </div>
    </>
  )
}

export default DialogServiceCustomActionsDemo
