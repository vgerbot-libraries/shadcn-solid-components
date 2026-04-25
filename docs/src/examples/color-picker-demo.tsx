import { createSignal } from "solid-js"
import { ColorPicker } from "shadcn-solid-components/components/color-picker"

const ColorPickerDemo = () => {
  const [color, setColor] = createSignal("#4A86E8")

  return (
    <ColorPicker
      value={color()}
      onValueChange={setColor}
      mode="inline"
    />
  )
}

export default ColorPickerDemo
