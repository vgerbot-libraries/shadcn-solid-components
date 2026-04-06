import { Timeline } from "shadcn-solid-components/hoc/timeline"

const TimelineDemo = () => {
  return (
    <Timeline
      mode="alternate"
      items={[
        {
          title: "Deployed",
          time: "09:00",
          description: "v2.4.0 to production",
          color: "text-emerald-500",
          content: (
            <a class="text-xs text-primary underline" href="/releases">
              View release
            </a>
          ),
        },
        {
          title: "Rollback",
          time: "11:30",
          icon: <span class="text-lg">!</span>,
        },
      ]}
    />
  )
}

export default TimelineDemo
