import { DateTimePickerField } from "shadcn-solid-components/hoc/date-time-picker"

const DateTimePickerFieldRangeDemo = () => {
  return (
    <DateTimePickerField
      label="Maintenance window"
      selectionMode="range"
      hourCycle={24}
      clearable
      presets={[
        { label: "Last 24 hours", value: "last3Days" },
        { label: "Last 7 days", value: "last7Days" },
        { label: "Last 30 days", value: "last30Days" },
      ]}
    />
  )
}

export default DateTimePickerFieldRangeDemo
