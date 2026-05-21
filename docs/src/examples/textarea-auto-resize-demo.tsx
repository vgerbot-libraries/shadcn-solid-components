import {
  Textarea,
  TextareaCount,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'
import { createSignal } from 'solid-js'

const TextareaAutoResizeDemo = () => {
  const [value, setValue] = createSignal('')

  return (
    <TextareaField class="w-full max-w-xl gap-1.5">
      <TextareaLabel for="textarea-auto-resize-message">Auto-resize note</TextareaLabel>
      <Textarea
        id="textarea-auto-resize-message"
        value={value()}
        autoResize
        size="sm"
        rows={2}
        placeholder="Start typing and the textarea grows with content."
        onInput={event => setValue(event.currentTarget.value)}
      />
      <div class="flex items-center justify-between gap-2">
        <TextareaDescription class="text-xs">
          This demo disables manual resize while autoResize is enabled.
        </TextareaDescription>
        <TextareaCount value={value()} />
      </div>
    </TextareaField>
  )
}

export default TextareaAutoResizeDemo
