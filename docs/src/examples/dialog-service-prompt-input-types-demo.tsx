import { Button } from 'shadcn-solid-components/components/button'
import {
  DialogServiceHost,
  type PromptDialogResult,
  prompt,
} from 'shadcn-solid-components/hoc/dialog-service'
import { createSignal } from 'solid-js'

const DialogServicePromptInputTypesDemo = () => {
  const [result, setResult] = createSignal<PromptDialogResult | null>(null)

  return (
    <>
      <DialogServiceHost />
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <p class="text-muted-foreground text-xs">Built-in string mode</p>
          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const next = await prompt({
                  title: 'Rename project',
                  description: 'Use built-in text input.',
                  input: 'text',
                  required: true,
                  placeholder: 'My Project',
                })
                setResult(next)
              }}
            >
              text
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const next = await prompt({
                  title: 'Enter admin password',
                  input: 'password',
                  required: true,
                  dismissible: false,
                })
                setResult(next)
              }}
            >
              password
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const next = await prompt({
                  title: 'Schedule publish time',
                  input: 'datetime',
                })
                setResult(next)
              }}
            >
              datetime
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const next = await prompt({
                  title: 'Deployment note',
                  description: 'Use built-in textarea.',
                  input: 'textarea',
                  placeholder: 'What changed in this release?',
                })
                setResult(next)
              }}
            >
              textarea
            </Button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-muted-foreground text-xs">Custom renderer mode</p>
          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const next = await prompt({
                  title: 'Custom input element',
                  input: (set, value) => (
                    <input
                      class="border-input rounded-component h-9 w-full border px-3 text-sm"
                      value={value}
                      placeholder="Custom value"
                      onInput={event => set(event.currentTarget.value)}
                    />
                  ),
                })
                setResult(next)
              }}
            >
              custom input
            </Button>
          </div>
        </div>
        <p class="text-muted-foreground text-sm">
          Last result: {result() ? `${result()!.actionKey} / value=${result()!.value}` : 'none'}
        </p>
      </div>
    </>
  )
}

export default DialogServicePromptInputTypesDemo
