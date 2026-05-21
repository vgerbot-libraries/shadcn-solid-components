import {
  Textarea,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'

const TextareaDisabledDemo = () => {
  return (
    <TextareaField class="w-full max-w-xl">
      <TextareaLabel for="textarea-disabled-note">Notes</TextareaLabel>
      <Textarea
        id="textarea-disabled-note"
        disabled
        placeholder="This textarea is currently disabled."
      />
      <TextareaDescription>
        This field becomes editable after switching to edit mode.
      </TextareaDescription>
    </TextareaField>
  )
}

export default TextareaDisabledDemo
