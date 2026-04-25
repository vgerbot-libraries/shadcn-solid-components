import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelineCustomIconDemo = () => {
  return (
    <Timeline
      mode="left"
      items={[
        {
          title: "User registered",
          time: "09:00",
          description: "New account created via email.",
          icon: <span class="text-sm">👤</span>,
          color: "text-blue-500",
        },
        {
          title: "Email verified",
          time: "09:15",
          description: "Confirmation link clicked.",
          icon: <span class="text-sm">✉️</span>,
          color: "text-emerald-500",
        },
        {
          title: "Profile completed",
          time: "09:45",
          description: "Avatar and bio updated.",
          icon: <span class="text-sm">✅</span>,
          color: "text-emerald-500",
        },
        {
          title: "First purchase",
          time: "11:20",
          description: "Ordered the Starter plan.",
          icon: <span class="text-sm">💳</span>,
          color: "text-violet-500",
          content: (
            <div class="rounded-md border bg-muted/50 p-2 text-xs">
              $9.99/month · Renews on May 1
            </div>
          ),
        },
        {
          title: "Support ticket",
          time: "14:00",
          description: "Opened ticket #678 for billing inquiry.",
          icon: <span class="text-sm">🎧</span>,
          color: "text-amber-500",
        },
      ]}
    />
  )
}

export default TimelineCustomIconDemo
