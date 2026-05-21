import {
  Textarea,
  TextareaDescription,
  TextareaField,
  TextareaLabel,
} from 'shadcn-solid-components/components/textarea'

const TextareaDemo = () => {
  return (
    <TextareaField class="w-full max-w-xl">
      <TextareaLabel for="textarea-demo-message">Message</TextareaLabel>
      <Textarea id="textarea-demo-message" placeholder="Type your message here." />
      <TextareaDescription>
        Provide enough detail so your request can be handled quickly.
      </TextareaDescription>
    </TextareaField>
  )
}

export default TextareaDemo
