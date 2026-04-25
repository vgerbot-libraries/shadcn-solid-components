import { type Component, createSignal, For } from 'solid-js'
import {
  Calendar,
  CalendarCell,
  CalendarCellTrigger,
  CalendarHeadCell,
  CalendarLabel,
  CalendarNav,
  CalendarTable,
} from 'shadcn-solid-components/components/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from 'shadcn-solid-components/components/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxTrigger,
} from 'shadcn-solid-components/components/combobox'
import { ColorPicker } from 'shadcn-solid-components/components/color-picker'
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerPositioner,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from 'shadcn-solid-components/components/date-picker'
import {
  IconBold,
  IconItalic,
  IconMinus,
  IconPlus,
  IconUnderline,
} from 'shadcn-solid-components/components/icons'
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel,
} from 'shadcn-solid-components/components/number-field'
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from 'shadcn-solid-components/components/otp-field'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemInput,
  RadioGroupItemLabel,
  RadioGroupItems,
  RadioGroupLabel,
} from 'shadcn-solid-components/components/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shadcn-solid-components/components/select'
import {
  Slider,
  SliderFill,
  SliderGroup,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from 'shadcn-solid-components/components/slider'
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from 'shadcn-solid-components/components/switch'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { ToggleButton } from 'shadcn-solid-components/components/toggle-button'
import { ToggleGroup, ToggleGroupItem } from 'shadcn-solid-components/components/toggle-group'
import { DatePickerField } from 'shadcn-solid-components/hoc/date-picker'
import { OTPFieldGroup as OTPFieldGroupHOC } from 'shadcn-solid-components/hoc/otp-field'
import { zhCN } from 'shadcn-solid-components/i18n/locales/zh-CN'
import { PageLayout } from '../components/PageLayout'

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']

const FormInputsPage: Component = () => {
  const [togglePressed, setTogglePressed] = createSignal(false)
  const [sliderValue, setSliderValue] = createSignal([50])
  const [inlineColor, setInlineColor] = createSignal('#3B82F6')
  const [popoverColor, setPopoverColor] = createSignal('rgba(16, 185, 129, 0.75)')

  return (
    <PageLayout
      title="Form Inputs"
      description="Input components: TextField, NumberField, Checkbox, RadioGroup, Select, Combobox, Switch, Slider, Toggle, OTP, Calendar, DatePicker."
    >
      <div class="grid gap-4 md:grid-cols-2">
        {/* TextField */}
        <Card>
          <CardHeader>
            <CardTitle>Text Field</CardTitle>
            <CardDescription>Text input with various types.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <TextField>
              <TextFieldInput placeholder="Default input" />
            </TextField>
            <TextField>
              <TextFieldInput type="email" placeholder="Email" />
            </TextField>
            <TextField>
              <TextFieldInput type="password" placeholder="Password" />
            </TextField>
            <TextField disabled>
              <TextFieldInput placeholder="Disabled" />
            </TextField>
          </CardContent>
        </Card>

        {/* NumberField */}
        <Card>
          <CardHeader>
            <CardTitle>Number Field</CardTitle>
            <CardDescription>Numeric input with increment/decrement.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <NumberField defaultValue={5} minValue={0} maxValue={100}>
              <NumberFieldLabel>Quantity</NumberFieldLabel>
              <NumberFieldGroup>
                <NumberFieldDecrementTrigger>
                  <IconMinus />
                </NumberFieldDecrementTrigger>
                <NumberFieldInput />
                <NumberFieldIncrementTrigger>
                  <IconPlus />
                </NumberFieldIncrementTrigger>
              </NumberFieldGroup>
            </NumberField>
          </CardContent>
        </Card>

        {/* Checkbox */}
        <Card>
          <CardHeader>
            <CardTitle>Checkbox</CardTitle>
            <CardDescription>Toggle options on/off.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <Checkbox>
              <CheckboxControl />
              <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
            </Checkbox>
            <Checkbox>
              <CheckboxControl />
              <CheckboxLabel>Send me email notifications</CheckboxLabel>
            </Checkbox>
            <Checkbox disabled>
              <CheckboxControl />
              <CheckboxLabel>Disabled option</CheckboxLabel>
            </Checkbox>
          </CardContent>
        </Card>

        {/* RadioGroup */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Group</CardTitle>
            <CardDescription>Select one from a set of options.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="comfortable">
              <RadioGroupLabel>Layout density</RadioGroupLabel>
              <RadioGroupItems>
                <RadioGroupItem value="compact">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>Compact</RadioGroupItemLabel>
                </RadioGroupItem>
                <RadioGroupItem value="comfortable">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>Comfortable</RadioGroupItemLabel>
                </RadioGroupItem>
                <RadioGroupItem value="spacious">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>Spacious</RadioGroupItemLabel>
                </RadioGroupItem>
              </RadioGroupItems>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Select */}
        <Card>
          <CardHeader>
            <CardTitle>Select</CardTitle>
            <CardDescription>Dropdown selection from a list.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <Select
              options={fruits}
              placeholder="Select a fruit..."
              itemComponent={props => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<string>>{state => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </CardContent>
        </Card>

        {/* Combobox */}
        <Card>
          <CardHeader>
            <CardTitle>Combobox</CardTitle>
            <CardDescription>Searchable dropdown selection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Combobox
              options={fruits}
              placeholder="Search fruits..."
              itemComponent={props => (
                <ComboboxItem item={props.item}>
                  <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
                </ComboboxItem>
              )}
            >
              <ComboboxControl>
                <ComboboxInput />
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent />
            </Combobox>
          </CardContent>
        </Card>

        {/* Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Switch</CardTitle>
            <CardDescription>Toggle between on and off states.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <Switch>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel>Airplane Mode</SwitchLabel>
            </Switch>
            <Switch defaultChecked>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel>Notifications</SwitchLabel>
            </Switch>
            <Switch disabled>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel>Disabled</SwitchLabel>
            </Switch>
          </CardContent>
        </Card>

        {/* Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Slider</CardTitle>
            <CardDescription>Range selection with a draggable thumb.</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              value={sliderValue()}
              onChange={setSliderValue}
              minValue={0}
              maxValue={100}
              step={1}
            >
              <SliderGroup>
                <SliderLabel>Volume</SliderLabel>
                <SliderValueLabel />
              </SliderGroup>
              <SliderTrack>
                <SliderFill />
                <SliderThumb />
              </SliderTrack>
            </Slider>
          </CardContent>
        </Card>

        {/* Color Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
            <CardDescription>
              Color selection with board, hue/alpha sliders, editable inputs, and preset swatches.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div class="grid gap-2">
              <span class="text-sm font-medium">Inline mode</span>
              <ColorPicker
                mode="inline"
                value={inlineColor()}
                onValueChange={setInlineColor}
                format="hex"
              />
              <p class="text-xs text-muted-foreground">Value: {inlineColor()}</p>
            </div>

            <div class="grid gap-2">
              <span class="text-sm font-medium">Popover mode</span>
              <ColorPicker
                mode="popover"
                value={popoverColor()}
                onValueChange={setPopoverColor}
                format="rgb"
              />
              <p class="text-xs text-muted-foreground">Value: {popoverColor()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        {/* ToggleButton + ToggleGroup */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Button & Group</CardTitle>
            <CardDescription>Pressable toggle buttons, alone or as a group.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <ToggleButton pressed={togglePressed()} onChange={setTogglePressed}>
                <IconBold />
              </ToggleButton>
              <span class="text-muted-foreground text-sm">
                Pressed: {togglePressed() ? 'Yes' : 'No'}
              </span>
            </div>
            <ToggleGroup>
              <ToggleGroupItem value="bold">
                <IconBold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic">
                <IconItalic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline">
                <IconUnderline />
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup variant="outline">
              <ToggleGroupItem value="bold">
                <IconBold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic">
                <IconItalic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline">
                <IconUnderline />
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* OTPField */}
        <Card>
          <CardHeader>
            <CardTitle>OTP Field</CardTitle>
            <CardDescription>One-time password input with individual slots.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <OTPField maxLength={6}>
              <OTPFieldInput />
              <OTPFieldGroup>
                <OTPFieldSlot index={0} />
                <OTPFieldSlot index={1} />
                <OTPFieldSlot index={2} />
              </OTPFieldGroup>
              <OTPFieldSeparator />
              <OTPFieldGroup>
                <OTPFieldSlot index={3} />
                <OTPFieldSlot index={4} />
                <OTPFieldSlot index={5} />
              </OTPFieldGroup>
            </OTPField>
          </CardContent>
        </Card>

        {/* OTPField HOC */}
        <Card>
          <CardHeader>
            <CardTitle>OTP Field (HOC)</CardTitle>
            <CardDescription>Pre-composed OTP field with grouping and labels.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            <OTPFieldGroupHOC
              maxLength={6}
              groupPattern={[3, 3]}
              label="Verification Code"
              description="Enter the 6-digit code sent to your email."
              required
            />
            <OTPFieldGroupHOC maxLength={4} label="PIN" error="Invalid PIN code" required />
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Date picker calendar view.</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center">
          <Calendar mode="single">
            {state => (
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <CalendarNav action="prev-month" />
                  <CalendarLabel>
                    {state.month.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </CalendarLabel>
                  <CalendarNav action="next-month" />
                </div>
                <CalendarTable>
                  <thead>
                    <tr class="flex">
                      <For each={state.weekdays}>
                        {weekday => (
                          <CalendarHeadCell>
                            {weekday.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)}
                          </CalendarHeadCell>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={state.weeks}>
                      {week => (
                        <tr class="flex w-full mt-2">
                          <For each={week}>
                            {day => (
                              <CalendarCell>
                                <CalendarCellTrigger day={day}>{day.getDate()}</CalendarCellTrigger>
                              </CalendarCell>
                            )}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </CalendarTable>
              </div>
            )}
          </Calendar>
        </CardContent>
      </Card>

      {/* DatePicker */}
      <Card>
        <CardHeader>
          <CardTitle>Date Picker</CardTitle>
          <CardDescription>Popover date picker with day, month, and year views.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <DatePicker>
            <DatePickerControl>
              <DatePickerInput />
              <DatePickerTrigger />
            </DatePickerControl>
            <DatePickerPositioner>
              <DatePickerContent>
                <DatePickerContext>
                  {api => (
                    <>
                      <DatePickerView view="day">
                        <DatePickerViewControl>
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableHead>
                            <DatePickerTableRow>
                              <For each={api().weekDays}>
                                {weekDay => (
                                  <DatePickerTableHeader>{weekDay.short}</DatePickerTableHeader>
                                )}
                              </For>
                            </DatePickerTableRow>
                          </DatePickerTableHead>
                          <DatePickerTableBody>
                            <For each={api().weeks}>
                              {week => (
                                <DatePickerTableRow>
                                  <For each={week}>
                                    {day => (
                                      <DatePickerTableCell value={day}>
                                        <DatePickerTableCellTrigger>
                                          {day.day}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </DatePickerView>
                      <DatePickerView view="month">
                        <DatePickerViewControl>
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableBody>
                            <For each={api().getMonthsGrid({ columns: 4, format: 'short' })}>
                              {months => (
                                <DatePickerTableRow>
                                  <For each={months}>
                                    {month => (
                                      <DatePickerTableCell value={month.value}>
                                        <DatePickerTableCellTrigger>
                                          {month.label}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </DatePickerView>
                      <DatePickerView view="year">
                        <DatePickerViewControl>
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableBody>
                            <For each={api().getYearsGrid({ columns: 4 })}>
                              {years => (
                                <DatePickerTableRow>
                                  <For each={years}>
                                    {year => (
                                      <DatePickerTableCell value={year.value}>
                                        <DatePickerTableCellTrigger>
                                          {year.label}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </DatePickerView>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerContent>
            </DatePickerPositioner>
          </DatePicker>
        </CardContent>
      </Card>

      {/* DatePicker HOC */}
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Date Picker (HOC)</CardTitle>
            <CardDescription>Pre-composed date picker with label and description.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            <DatePickerField
              label="Date of Birth"
              required
              description="Select your date of birth."
            />
            <DatePickerField label="Deadline" clearable error="This field is required" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Picker Range (HOC)</CardTitle>
            <CardDescription>Range selection with preset quick-select options.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            <DatePickerField
              label="Date Range"
              selectionMode="range"
              numOfMonths={2}
              presets={[
                { label: 'Last 7 Days', value: 'last7Days' },
                { label: 'Last 30 Days', value: 'last30Days' },
                { label: 'This Month', value: 'thisMonth' },
                { label: 'Last Month', value: 'lastMonth' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Picker Multiple (HOC)</CardTitle>
            <CardDescription>Select multiple dates, displayed as removable tags.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField label="Select dates" selectionMode="multiple" clearable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Picker Inline (HOC)</CardTitle>
            <CardDescription>Always-visible inline calendar, no popover.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField inline />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Picker i18n (HOC)</CardTitle>
            <CardDescription>Chinese locale with 2-month display.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField
              label="日期"
              locale="zh-CN"
              i18n={zhCN.DatePickerField}
              numOfMonths={2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Month/Year Select (HOC)</CardTitle>
            <CardDescription>Dropdown selects for quick month/year navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField label="Event Date" showMonthYearSelect showTodayButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Month Picker (HOC)</CardTitle>
            <CardDescription>Select by month only, using minView and defaultView.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField label="Billing Month" defaultView="month" minView="month" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year Picker (HOC)</CardTitle>
            <CardDescription>Select by year only, using minView and defaultView.</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField label="Fiscal Year" defaultView="year" minView="year" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Footer (HOC)</CardTitle>
            <CardDescription>
              Custom footer slot with Today button and extra content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerField
              label="Appointment"
              showTodayButton
              calendarFooter={
                <p class="text-xs text-muted-foreground mt-2 text-center">
                  Weekends are unavailable
                </p>
              }
              isDateUnavailable={date => {
                const d = new Date(date.year, date.month - 1, date.day)
                return d.getDay() === 0 || d.getDay() === 6
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default FormInputsPage
