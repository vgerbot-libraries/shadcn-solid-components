import { ActivityFeed, type ActivityItem } from "shadcn-solid-components/hoc/activity-feed"

const items: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Alice Green", initials: "AG" },
    action: "commented on",
    target: "Pull Request #42",
    timestamp: "2 hours ago",
    group: "Today",
    meta: (
      <p class="bg-muted rounded-md p-2 text-sm">
        Looks great! Just one small nit on line 28.
      </p>
    ),
  },
  {
    id: "2",
    user: { name: "Bob Smith", initials: "BS" },
    action: "merged",
    target: "feat/dashboard-v2",
    timestamp: "4 hours ago",
    group: "Today",
  },
  {
    id: "3",
    user: { name: "Carol Davis", initials: "CD" },
    action: "opened issue",
    target: "#189",
    timestamp: "Yesterday",
    group: "Yesterday",
  },
]

const ActivityFeedDemo = () => {
  return <ActivityFeed items={items} groupBy="date" />
}

export default ActivityFeedDemo
