import { Button } from "shadcn-solid-components/components/button"
import { Toaster } from "shadcn-solid-components/components/sonner"
import { useNotify } from "shadcn-solid-components/hoc/use-notify"

const UseNotifyDemo = () => {
  const notify = useNotify({ type: "info", duration: 3000 })

  return (
    <>
      <Toaster />
      <div class="flex gap-2">
        <Button type="button" variant="outline" onClick={() => notify(<>Sync started</>)}>
          Info toast
        </Button>
        <Button type="button" onClick={() => notify.success(<>Saved</>)}>
          Success toast
        </Button>
      </div>
    </>
  )
}

export default UseNotifyDemo
