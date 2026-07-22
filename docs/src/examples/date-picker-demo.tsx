import { DatePicker } from 'shadcn-solid-components/hoc/date-picker'
import { FormField } from 'shadcn-solid-components/hoc/form-field'

const DatePickerFormFieldDemo = () => {
  return (
    <div class="grid w-full max-w-md gap-4">
      <FormField label="Departure date" description="Select your departure date.">
        <DatePicker selectionMode="single" placeholder="Choose a date" clearable showTodayButton />
      </FormField>
      <FormField label="Reporting range">
        <DatePicker
          selectionMode="range"
          presets={[
            { label: 'Last 7 days', value: 'last7Days' },
            { label: 'This month', value: 'thisMonth' },
          ]}
        />
      </FormField>
    </div>
  )
}

export default DatePickerFormFieldDemo
