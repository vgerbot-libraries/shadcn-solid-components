import { Checkbox } from 'shadcn-solid-components/mobile/checkbox'
import { createSignal } from 'solid-js'

const CheckboxDemo = () => {
  const [checked, setChecked] = createSignal(false)

  return (
    <div class="flex flex-col gap-6 p-4">
      <Checkbox defaultChecked>Agree to the terms</Checkbox>
      <Checkbox checked={checked()} onChange={next => setChecked(next)} />
    </div>
  )
}

export default CheckboxDemo
