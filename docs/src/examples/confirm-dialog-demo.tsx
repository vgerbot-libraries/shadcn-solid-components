import { Button } from "shadcn-solid-components/components/button"
import { ConfirmDialog, confirm } from "shadcn-solid-components/hoc/confirm-dialog"

const ConfirmDialogDemo = () => {
  return (
    <>
      <ConfirmDialog />
      <Button
        variant="outline"
        onClick={async () => {
          await confirm({
            title: "Unsaved changes",
            description: "Save before leaving?",
            variant: "default",
            locale: { confirm: "Save and continue", cancel: "Stay on page" },
          })
        }}
      >
        Leave page
      </Button>
    </>
  )
}

export default ConfirmDialogDemo
