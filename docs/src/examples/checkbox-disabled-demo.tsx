import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from "shadcn-solid-components/components/checkbox"

const CheckboxDisabledDemo = () => {
  return (
    <Checkbox class="flex items-center gap-3" disabled>
      <CheckboxControl />
      <CheckboxLabel>Enable notifications</CheckboxLabel>
    </Checkbox>
  )
}

export default CheckboxDisabledDemo
