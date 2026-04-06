import { createSignal } from "solid-js"

import { Button } from "shadcn-solid-components/components/button"
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "shadcn-solid-components/components/popover"

const PopoverControlledDemo = () => {
  const [open, setOpen] = createSignal(false)

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger<typeof Button>
        as={(props) => (
          <Button variant="outline" {...props}>
            {open() ? "Close" : "Open"} popover
          </Button>
        )}
      />
      <PopoverPortal>
        <PopoverContent class="w-72">
          <p class="text-muted-foreground mb-3 text-sm">
            Controlled example: the trigger label reflects open state.
          </p>
          <Button
            class="w-full"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Close from inside
          </Button>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}

export default PopoverControlledDemo
