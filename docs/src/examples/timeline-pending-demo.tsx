import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelinePendingDemo = () => {
  return (
    <Timeline
      mode="left"
      pending
      items={[
        {
          title: "Order placed",
          time: "10:00",
          description: "Your order #12345 has been received.",
          color: "text-blue-500",
        },
        {
          title: "Payment confirmed",
          time: "10:05",
          description: "Payment of $49.99 processed successfully.",
          color: "text-emerald-500",
        },
        {
          title: "Processing",
          time: "10:30",
          description: "Warehouse is preparing your items.",
          color: "text-amber-500",
        },
      ]}
    />
  )
}

export default TimelinePendingDemo
