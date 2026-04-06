import { Button } from "shadcn-solid-components/components/button"
import type { TooltipTriggerProps } from "shadcn-solid-components/components/tooltip"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "shadcn-solid-components/components/tooltip"

const TooltipDemo = () => {
  return (
    <Tooltip>
      <TooltipTrigger
        as={(props: TooltipTriggerProps) => (
          <Button variant="outline" {...props}>
            Hover
          </Button>
        )}
      />
      <TooltipPortal>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export default TooltipDemo
