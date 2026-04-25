import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelineLeftDemo = () => {
  return (
    <Timeline
      mode="left"
      items={[
        {
          title: "Meeting scheduled",
          time: "09:00",
          description: "Weekly standup with the design team.",
        },
        {
          title: "Design review",
          time: "10:30",
          description: "Reviewed the new dashboard mockups.",
          color: "text-blue-500",
        },
        {
          title: "Code merged",
          time: "14:00",
          description: "PR #142 merged into main branch.",
          color: "text-emerald-500",
        },
        {
          title: "Deployed",
          time: "15:30",
          description: "v2.4.0 deployed to production.",
          color: "text-emerald-500",
        },
      ]}
    />
  )
}

export default TimelineLeftDemo
