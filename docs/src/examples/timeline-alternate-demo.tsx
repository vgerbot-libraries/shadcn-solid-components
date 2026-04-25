import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelineAlternateDemo = () => {
  return (
    <Timeline
      mode="alternate"
      items={[
        {
          title: "Project created",
          time: "2024-01-01",
          description: "Repository initialized with SolidStart template.",
          color: "text-blue-500",
        },
        {
          title: "First milestone",
          time: "2024-02-15",
          description: "Core UI components completed.",
          color: "text-emerald-500",
          content: (
            <div class="rounded-md border bg-muted/50 p-2 text-xs">
              12 components shipped
            </div>
          ),
        },
        {
          title: "Bug discovered",
          time: "2024-03-03",
          description: "Memory leak in reactive subscriptions.",
          color: "text-red-500",
          icon: <span class="text-sm">🐛</span>,
        },
        {
          title: "Patch released",
          time: "2024-03-05",
          description: "v1.0.1 fixes the subscription leak.",
          color: "text-amber-500",
          content: (
            <a class="text-xs text-primary underline" href="/releases">
              View changelog
            </a>
          ),
        },
        {
          title: "v2.0 launch",
          time: "2024-06-01",
          description: "Major release with new design system.",
          color: "text-emerald-500",
          icon: <span class="text-sm">🚀</span>,
        },
      ]}
    />
  )
}

export default TimelineAlternateDemo
