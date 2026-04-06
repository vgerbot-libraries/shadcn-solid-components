import { IconUsers } from "shadcn-solid-components/components/icons"
import { StatCard } from "shadcn-solid-components/hoc/stat-card"

const StatCardDemo = () => {
  return (
    <StatCard
      label="Active users"
      value={1284}
      trend="neutral"
      icon={<IconUsers class="text-muted-foreground size-4" />}
    />
  )
}

export default StatCardDemo
