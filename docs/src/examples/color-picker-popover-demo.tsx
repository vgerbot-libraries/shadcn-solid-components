import { createSignal } from "solid-js"
import { ColorPicker } from "shadcn-solid-components/components/color-picker"

const ColorPickerPopoverDemo = () => {
  const [color, setColor] = createSignal("#FF9900")

  return (
    <ColorPicker
      value={color()}
      onValueChange={setColor}
      mode="popover"
      showAlpha
    />
  )
}

export default ColorPickerPopoverDemo
