import { Button } from 'shadcn-solid-components/components/button'
import {
  Textarea,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'

const TextareaWithButtonDemo = () => {
  return (
    <TextareaField class="w-full max-w-xl gap-3">
      <TextareaLabel for="textarea-with-button-message">Comment</TextareaLabel>
      <Textarea id="textarea-with-button-message" rows={4} placeholder="Share your feedback..." />
      <div class="flex items-center justify-between gap-2">
        <TextareaDescription class="text-xs">
          Comments are visible to everyone in this thread.
        </TextareaDescription>
        <Button size="sm" type="button">
          Send
        </Button>
      </div>
    </TextareaField>
  )
}

export default TextareaWithButtonDemo
