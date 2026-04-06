import { Button } from "shadcn-solid-components/components/button"
import { EmptyState } from "shadcn-solid-components/hoc/empty-state"

const EmptyStateDemo = () => {
  return (
    <EmptyState
      icon={<span class="text-4xl">📂</span>}
      title="No projects yet"
      description="Create a project or adjust your filters."
      action={<Button>Create project</Button>}
    />
  )
}

export default EmptyStateDemo
