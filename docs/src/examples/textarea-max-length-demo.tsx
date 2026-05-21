import {
  Textarea,
  TextareaCount,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'
import { createSignal } from 'solid-js'

const MAX_LENGTH = 180

const TextareaMaxLengthDemo = () => {
  const [value, setValue] = createSignal('')

  return (
    <TextareaField class="w-full max-w-xl gap-1.5">
      <TextareaLabel for="textarea-max-length-message">Summary</TextareaLabel>
      <Textarea
        id="textarea-max-length-message"
        value={value()}
        maxLength={MAX_LENGTH}
        placeholder="Summarize your update in a few lines."
        onInput={event => setValue(event.currentTarget.value)}
      />
      <div class="flex items-center justify-between gap-2">
        <TextareaDescription class="text-xs">
          Keep it concise and action oriented.
        </TextareaDescription>
        <TextareaCount value={value()} maxLength={MAX_LENGTH} />
      </div>
    </TextareaField>
  )
}

export default TextareaMaxLengthDemo
