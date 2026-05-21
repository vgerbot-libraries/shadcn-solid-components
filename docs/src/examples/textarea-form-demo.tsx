import { Button } from 'shadcn-solid-components/components/button'
import {
  Textarea,
  TextareaCount,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'
import { createSignal, Show } from 'solid-js'

const TextareaFormDemo = () => {
  const [value, setValue] = createSignal('')
  const [error, setError] = createSignal<string | null>(null)

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (value().trim().length < 20) {
      setError('Message must be at least 20 characters.')
      return
    }

    setError(null)
  }

  return (
    <form class="w-full max-w-xl space-y-3" onSubmit={handleSubmit}>
      <TextareaField class="gap-1.5">
        <TextareaLabel for="textarea-form-message">Support request</TextareaLabel>
        <Textarea
          id="textarea-form-message"
          value={value()}
          rows={4}
          aria-invalid={error() ? true : undefined}
          placeholder="Describe the issue and include steps to reproduce."
          onInput={event => setValue(event.currentTarget.value)}
        />

        <div class="flex items-center justify-between gap-2">
          <TextareaDescription class="text-xs">
            Include expected behavior and actual behavior.
          </TextareaDescription>
          <TextareaCount value={value()} />
        </div>

        <Show when={error()}>
          <p class="text-destructive text-sm">{error()}</p>
        </Show>
      </TextareaField>

      <div class="flex justify-end">
        <Button size="sm" type="submit">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default TextareaFormDemo
