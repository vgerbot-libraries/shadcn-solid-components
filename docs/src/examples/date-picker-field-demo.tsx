import { DatePickerField } from "shadcn-solid-components/hoc/date-picker"

const DatePickerFieldDemo = () => {
  return (
    <div class="grid w-full max-w-md gap-4">
      <DatePickerField
        label="Departure date"
        selectionMode="single"
        placeholder="Choose a date"
        clearable
        showTodayButton
      />
      <DatePickerField
        label="Reporting range"
        selectionMode="range"
        presets={[
          { label: "Last 7 days", value: "last7Days" },
          { label: "This month", value: "thisMonth" },
        ]}
      />
    </div>
  )
}

export default DatePickerFieldDemo
