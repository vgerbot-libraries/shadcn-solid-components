import { Button } from 'shadcn-solid-components/components/button'
import {
  confirm,
  type DialogActionResult,
  DialogServiceHost,
} from 'shadcn-solid-components/hoc/dialog-service'
import { createSignal } from 'solid-js'

const DialogServiceConfirmDemo = () => {
  const [result, setResult] = createSignal<DialogActionResult | null>(null)

  return (
    <>
      <DialogServiceHost />
      <div class="flex flex-col gap-3">
        <Button
          variant="destructive"
          onClick={async () => {
            const next = await confirm({
              title: 'Delete this project?',
              description: 'This action cannot be undone.',
              variant: 'destructive',
              dismissible: false,
            })
            setResult(next)
          }}
        >
          Open confirm
        </Button>
        <p class="text-muted-foreground text-sm">
          Last result:{' '}
          {result() ? `${result()!.actionKey} / confirmed=${String(result()!.confirmed)}` : 'none'}
        </p>
      </div>
    </>
  )
}

export default DialogServiceConfirmDemo
