import { ColorModeProvider } from "@kobalte/core"

import { ModeToggleGroup } from "shadcn-solid-components/hoc/mode-toggle-group"

const ModeToggleGroupDemo = () => {
  return (
    <ColorModeProvider>
      <ModeToggleGroup aria-label="Color mode" lightLabel="Light" darkLabel="Dark" />
    </ColorModeProvider>
  )
}

export default ModeToggleGroupDemo
