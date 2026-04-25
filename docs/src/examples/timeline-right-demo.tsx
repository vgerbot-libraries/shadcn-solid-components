import { Timeline } from "shadcn-solid-components/components/timeline"

const TimelineRightDemo = () => {
  return (
    <Timeline
      mode="right"
      items={[
        {
          title: "Application submitted",
          time: "Jan 15",
          description: "Your application has been received.",
        },
        {
          title: "Under review",
          time: "Jan 18",
          description: "The admissions team is reviewing your file.",
          color: "text-amber-500",
        },
        {
          title: "Interview scheduled",
          time: "Jan 22",
          description: "Video interview set for Feb 1.",
          color: "text-blue-500",
        },
        {
          title: "Accepted",
          time: "Feb 5",
          description: "Congratulations! You have been admitted.",
          color: "text-emerald-500",
        },
      ]}
    />
  )
}

export default TimelineRightDemo
