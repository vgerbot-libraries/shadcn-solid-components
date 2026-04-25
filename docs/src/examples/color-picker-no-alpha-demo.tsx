import { createSignal } from "solid-js"
import { ColorPicker } from "shadcn-solid-components/components/color-picker"

const ColorPickerNoAlphaDemo = () => {
  const [color, setColor] = createSignal("#00FF00")

  return (
    <ColorPicker
      value={color()}
      onValueChange={setColor}
      mode="inline"
      showAlpha={false}
    />
  )
}

export default ColorPickerNoAlphaDemo
