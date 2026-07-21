import { DateTimePickerField } from "shadcn-solid-components/hoc/date-time-picker"

const DateTimePickerFieldDemo = () => {
  return (
    <div class="grid w-full max-w-md gap-4">
      <DateTimePickerField
        label="Appointment"
        required
        description="Select your preferred date and time."
        clearable
        showTodayButton
      />
      <DateTimePickerField
        label="Schedule range"
        selectionMode="range"
        hourCycle={24}
        presets={[
          { label: "Last 7 days", value: "last7Days" },
          { label: "This month", value: "thisMonth" },
        ]}
      />
    </div>
  )
}

export default DateTimePickerFieldDemo
