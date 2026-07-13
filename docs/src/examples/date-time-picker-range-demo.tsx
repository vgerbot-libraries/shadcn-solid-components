import { DateTimePicker } from 'shadcn-solid-components/components/date-time-picker'

const DateTimePickerRangeDemo = () => {
  return (
    <DateTimePicker
      selectionMode="range"
      clearable
      rangeStartPlaceholder="Start date & time"
      rangeEndPlaceholder="End date & time"
    />
  )
}

export default DateTimePickerRangeDemo
