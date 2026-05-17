import { Button } from "shadcn-solid-components/components/button"
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "shadcn-solid-components/components/popover"

const PopoverSimpleDemo = () => {
  return (
    <Popover>
      <PopoverTrigger<typeof Button>
        as={(props) => (
          <Button variant="outline" {...props}>
            Info
          </Button>
        )}
      />
      <PopoverPortal>
        <PopoverContent class="w-72">
          <p class="text-sm leading-relaxed">
            Popover content can be any markup: short help text, actions, or a
            compact form. Size the panel with utilities on{" "}
            <code class="rounded bg-muted px-1 py-0.5 text-xs">
              PopoverContent
            </code>
            .
          </p>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}

export default PopoverSimpleDemo
