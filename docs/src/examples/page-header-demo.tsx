import { Button } from "shadcn-solid-components/components/button"
import { PageHeader } from "shadcn-solid-components/hoc/page-header"

const PageHeaderDemo = () => {
  return (
    <PageHeader
      breadcrumbs={[{ label: "App", href: "/" }, { label: "Billing" }]}
      title="Billing"
      description={<span class="text-muted-foreground text-sm">Manage payment methods.</span>}
      actions={
        <Button size="sm" variant="outline">
          Export
        </Button>
      }
      separator
    />
  )
}

export default PageHeaderDemo
