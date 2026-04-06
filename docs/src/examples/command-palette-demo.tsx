import { createSignal } from "solid-js"

import { Button } from "shadcn-solid-components/components/button"
import { CommandPalette } from "shadcn-solid-components/hoc/command-palette"

const CommandPaletteDemo = () => {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Open commands
      </Button>
      <CommandPalette
        hotkey={false}
        open={open()}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search and run actions"
        groups={[
          {
            label: "Navigation",
            items: [
              {
                id: "home",
                label: "Home",
                shortcut: "H",
                onSelect: () => setOpen(false),
              },
              {
                id: "settings",
                label: "Settings",
                icon: <span class="size-4 rounded bg-muted" aria-hidden />,
                onSelect: () => setOpen(false),
              },
            ],
          },
          {
            label: "Actions",
            items: [
              {
                id: "new-doc",
                label: "New document",
                shortcut: "N",
                onSelect: () => setOpen(false),
              },
              {
                id: "disabled-sample",
                label: "Coming soon",
                disabled: true,
              },
            ],
          },
        ]}
      />
    </>
  )
}

export default CommandPaletteDemo
