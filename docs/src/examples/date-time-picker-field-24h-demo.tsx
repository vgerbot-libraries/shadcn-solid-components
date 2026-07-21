import { DateTimePickerField } from "shadcn-solid-components/hoc/date-time-picker"

const DateTimePickerField24hDemo = () => {
  return (
    <DateTimePickerField
      label="Event start (24h)"
      hourCycle={24}
      minuteStep={15}
      clearable
    />
  )
}

export default DateTimePickerField24hDemo
