import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "shadcn-solid-components/components/text-field"

const TextFieldFileDemo = () => {
  return (
    <TextField class="max-w-xs">
      <TextFieldLabel>Picture</TextFieldLabel>
      <TextFieldInput type="file" />
    </TextField>
  )
}

export default TextFieldFileDemo
