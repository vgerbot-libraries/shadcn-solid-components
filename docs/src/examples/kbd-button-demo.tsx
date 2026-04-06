import { Button } from "shadcn-solid-components/components/button"
import { Kbd } from "shadcn-solid-components/components/kbd"

const KbdButtonDemo = () => {
  return (
    <div class="flex flex-wrap items-center gap-4">
      <Button variant="outline" size="sm" class="pr-2">
        Accept <Kbd>⏎</Kbd>
      </Button>
      <Button variant="outline" size="sm" class="pr-2">
        Cancel <Kbd>Esc</Kbd>
      </Button>
    </div>
  )
}

export default KbdButtonDemo
