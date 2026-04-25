import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelineOrderTrackingDemo = () => {
  return (
    <Timeline
      mode="left"
      pending
      items={[
        {
          title: "Order confirmed",
          time: "Mar 10, 09:00",
          description: "Order #20240310-001 has been placed.",
          icon: <span class="text-sm">📦</span>,
          color: "text-blue-500",
        },
        {
          title: "Picked & packed",
          time: "Mar 10, 14:30",
          description: "Items packed at Warehouse B.",
          icon: <span class="text-sm">📋</span>,
          color: "text-amber-500",
        },
        {
          title: "Shipped",
          time: "Mar 11, 08:00",
          description: "Carrier: FastShip Express. Tracking: FS-884312.",
          icon: <span class="text-sm">🚚</span>,
          color: "text-violet-500",
          content: (
            <a
              class="text-xs text-primary underline"
              href="https://example.com/track/FS-884312"
            >
              Track shipment
            </a>
          ),
        },
        {
          title: "Out for delivery",
          time: "Mar 12, 07:30",
          description: "With local courier — arriving today.",
          icon: <span class="text-sm">🏠</span>,
          color: "text-emerald-500",
        },
      ]}
    />
  )
}

export default TimelineOrderTrackingDemo
