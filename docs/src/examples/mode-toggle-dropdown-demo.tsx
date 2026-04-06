import { ColorModeProvider } from "@kobalte/core"

import { ModeToggleDropdown } from "shadcn-solid-components/hoc/mode-toggle-dropdown"

const ModeToggleDropdownDemo = () => {
  return (
    <ColorModeProvider>
      <div class="flex justify-end">
        <ModeToggleDropdown trigger={{ class: "size-9 px-0" }} />
      </div>
    </ColorModeProvider>
  )
}

export default ModeToggleDropdownDemo
