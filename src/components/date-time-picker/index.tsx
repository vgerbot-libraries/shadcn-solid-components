import type { DatePickerRootProps, DateValue } from '@ark-ui/solid/date-picker'
import { CalendarDateTime } from '@internationalized/date'
import { buttonVariants } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  DatePicker,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerMonthSelect,
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
  DatePickerYearSelect,
} from 'shadcn-solid-components/components/date-picker'
import { ScrollArea } from 'shadcn-solid-components/components/scroll-area'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { createMemo, createSignal, For, Show, splitProps } from 'solid-js'

export type DateTimePickerHourCycle = 12 | 24

export interface DateTimePickerProps extends DatePickerRootProps {
  hourCycle?: DateTimePickerHourCycle
  minuteStep?: number
  placeholder?: string
  rangeStartPlaceholder?: string
  rangeEndPlaceholder?: string
  clearable?: boolean
  contentClass?: string
  class?: string
  showMonthYearSelect?: boolean
}

const selectClass =
  'appearance-none border border-border rounded-component bg-background px-2 py-1 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring'

function normalizeMinuteStep(step?: number): number {
  if (!Number.isFinite(step)) {
    return 1
  }

  return Math.min(30, Math.max(1, Math.floor(step ?? 1)))
}

function getDateValueTime(value?: DateValue): { hour: number; minute: number } | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (!('hour' in value) || !('minute' in value)) {
    return null
  }

  if (typeof value.hour !== 'number' || typeof value.minute !== 'number') {
    return null
  }

  return {
    hour: value.hour,
    minute: value.minute,
  }
}

function getDateKey(value?: DateValue): string | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (!('year' in value) || !('month' in value) || !('day' in value)) {
    return null
  }

  if (
    typeof value.year !== 'number' ||
    typeof value.month !== 'number' ||
    typeof value.day !== 'number'
  ) {
    return null
  }

  return `${value.year}-${value.month}-${value.day}`
}

function getDateParts(value?: DateValue): { year: number; month: number; day: number } | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (!('year' in value) || !('month' in value) || !('day' in value)) {
    return null
  }

  if (
    typeof value.year !== 'number' ||
    typeof value.month !== 'number' ||
    typeof value.day !== 'number'
  ) {
    return null
  }

  return {
    year: value.year,
    month: value.month,
    day: value.day,
  }
}

function DayViewTable(props: {
  weeks: DateValue[][]
  weekDays: { short: string }[]
  visibleRange?: { start: DateValue; end: DateValue }
}) {
  return (
    <DatePickerTable>
      <DatePickerTableHead>
        <DatePickerTableRow>
          <For each={props.weekDays}>
            {weekDay => <DatePickerTableHeader>{weekDay.short}</DatePickerTableHeader>}
          </For>
        </DatePickerTableRow>
      </DatePickerTableHead>
      <DatePickerTableBody>
        <For each={props.weeks}>
          {week => (
            <DatePickerTableRow>
              <For each={week}>
                {day => (
                  <DatePickerTableCell value={day} visibleRange={props.visibleRange}>
                    <DatePickerTableCellTrigger>{day.day}</DatePickerTableCellTrigger>
                  </DatePickerTableCell>
                )}
              </For>
            </DatePickerTableRow>
          )}
        </For>
      </DatePickerTableBody>
    </DatePickerTable>
  )
}

function CalendarViews(props: { showMonthYearSelect?: boolean }) {
  return (
    <DatePickerContext>
      {api => {
        const numOfMonths = () => api().numOfMonths ?? 1
        const monthOffsets = () => Array.from({ length: numOfMonths() }, (_, i) => i)

        return (
          <>
            <DatePickerView view="day">
              <DatePickerViewControl>
                <Show
                  when={props.showMonthYearSelect}
                  fallback={
                    <DatePickerViewTrigger>
                      <DatePickerRangeText />
                    </DatePickerViewTrigger>
                  }
                >
                  <div class="flex items-center gap-1">
                    <DatePickerMonthSelect class={selectClass} />
                    <DatePickerYearSelect class={selectClass} />
                  </div>
                </Show>
              </DatePickerViewControl>
              <div class={cx(numOfMonths() > 1 && 'flex gap-4')}>
                <For each={monthOffsets()}>
                  {monthIndex => {
                    const offset = () =>
                      monthIndex === 0
                        ? { weeks: api().weeks, visibleRange: api().visibleRange }
                        : api().getOffset({ months: monthIndex })

                    return (
                      <div
                        class={cx(
                          numOfMonths() > 1 && 'min-w-[calc(var(--reference-width)-(0.75rem*2))]',
                        )}
                      >
                        <DayViewTable
                          weeks={offset().weeks}
                          weekDays={api().weekDays}
                          visibleRange={offset().visibleRange}
                        />
                      </div>
                    )
                  }}
                </For>
              </div>
            </DatePickerView>
          </>
        )
      }}
    </DatePickerContext>
  )
}

function TimePanel(props: {
  hourCycle: DateTimePickerHourCycle
  minuteStep: number
  activeRangeIndex: number
  onActiveRangeIndexChange: (index: number) => void
  resolveTimeForValue: (value?: DateValue) => { hour: number; minute: number } | null
  setTimeForValue: (value: DateValue, time: { hour: number; minute: number }) => void
}) {
  const minuteOptions = createMemo(() => {
    const values: number[] = []
    for (let minute = 0; minute < 60; minute += props.minuteStep) {
      values.push(minute)
    }
    return values
  })

  const hourOptions = createMemo(() => {
    if (props.hourCycle === 24) {
      return Array.from({ length: 24 }, (_, i) => i)
    }

    return Array.from({ length: 12 }, (_, i) => i + 1)
  })

  return (
    <DatePickerContext>
      {api => {
        const selectedIndex = () => (api().selectionMode === 'range' ? props.activeRangeIndex : 0)
        const fallbackDate = () => new Date()
        const selectedValue = () => api().value[selectedIndex()]
        const selectedTime = () => props.resolveTimeForValue(selectedValue())
        const selectedHour = () => selectedTime()?.hour ?? fallbackDate().getHours()
        const selectedMinute = () => selectedTime()?.minute ?? fallbackDate().getMinutes()
        const nowAsCalendarDateTime = () => {
          const now = new Date()

          return new CalendarDateTime(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
          )
        }

        const setTime = (hour: number, minute: number) => {
          const index = selectedIndex()
          const current = api().value[index]
          const focusedValue = api().focusedValue
          const fallback = focusedValue ?? nowAsCalendarDateTime()
          const base = current ?? focusedValue ?? fallback

          const nextValue =
            base instanceof CalendarDateTime
              ? base.set({ hour, minute })
              : new CalendarDateTime(base.year, base.month, base.day, hour, minute)

          const nextValues = [...api().value]
          if (api().selectionMode === 'range' && index === 1 && !nextValues[0] && focusedValue) {
            nextValues[0] = focusedValue
          }
          nextValues[index] = nextValue
          props.setTimeForValue(nextValue, { hour, minute })

          api().setValue([])
          queueMicrotask(() => {
            api().setValue(nextValues)
          })
        }

        const selectHour = (hourOption: number) => {
          const currentHour = selectedHour()

          if (props.hourCycle === 24) {
            setTime(hourOption, selectedMinute())
            return
          }

          const isPm = currentHour >= 12
          const normalizedHour = hourOption % 12
          setTime(normalizedHour + (isPm ? 12 : 0), selectedMinute())
        }

        const selectMinute = (minute: number) => {
          setTime(selectedHour(), minute)
        }

        const selectPeriod = (period: 'AM' | 'PM') => {
          const currentHour = selectedHour()
          const normalizedHour = currentHour % 12

          if (period === 'AM') {
            setTime(normalizedHour, selectedMinute())
            return
          }

          setTime(normalizedHour + 12, selectedMinute())
        }

        const hourLabel = (hour: number) => {
          if (props.hourCycle === 24) {
            return hour.toString().padStart(2, '0')
          }

          return hour.toString()
        }

        const isHourSelected = (hour: number) => {
          if (!selectedValue()) {
            return false
          }

          if (props.hourCycle === 24) {
            return selectedHour() === hour
          }

          return (selectedHour() % 12 || 12) === hour
        }

        return (
          <div
            data-slot="date-time-picker-time-panel"
            class="w-full min-w-[13.5rem] space-y-2 sm:h-[320px] overflow-hidden"
          >
            <Show when={api().selectionMode === 'range'}>
              <div class="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  class={buttonVariants({
                    variant: selectedIndex() === 0 ? 'default' : 'outline',
                    size: 'sm',
                  })}
                  onClick={() => props.onActiveRangeIndexChange(0)}
                >
                  Start
                </button>
                <button
                  type="button"
                  class={buttonVariants({
                    variant: selectedIndex() === 1 ? 'default' : 'outline',
                    size: 'sm',
                  })}
                  onClick={() => props.onActiveRangeIndexChange(1)}
                >
                  End
                </button>
              </div>
            </Show>

            <div
              class={cx(
                'grid gap-2 h-full',
                props.hourCycle === 12 ? 'grid-cols-3' : 'grid-cols-2',
              )}
            >
              <ScrollArea class="rounded-component border">
                <div class="grid gap-1 p-1">
                  <For each={hourOptions()}>
                    {hour => (
                      <button
                        type="button"
                        class={buttonVariants({
                          variant: isHourSelected(hour) ? 'default' : 'ghost',
                          size: 'icon',
                          class: 'h-8 w-full',
                        })}
                        onClick={() => selectHour(hour)}
                      >
                        {hourLabel(hour)}
                      </button>
                    )}
                  </For>
                </div>
              </ScrollArea>

              <ScrollArea class="rounded-component border">
                <div class="grid gap-1 p-1">
                  <For each={minuteOptions()}>
                    {minute => (
                      <button
                        type="button"
                        class={buttonVariants({
                          variant:
                            selectedValue() && selectedMinute() === minute ? 'default' : 'ghost',
                          size: 'icon',
                          class: 'h-8 w-full',
                        })}
                        onClick={() => selectMinute(minute)}
                      >
                        {minute.toString().padStart(2, '0')}
                      </button>
                    )}
                  </For>
                </div>
              </ScrollArea>

              <Show when={props.hourCycle === 12}>
                <ScrollArea class="rounded-component border">
                  <div class="grid gap-1 p-1">
                    <For each={['AM', 'PM'] as const}>
                      {period => (
                        <button
                          type="button"
                          class={buttonVariants({
                            variant:
                              selectedValue() &&
                              ((period === 'AM' && selectedHour() < 12) ||
                                (period === 'PM' && selectedHour() >= 12))
                                ? 'default'
                                : 'ghost',
                            size: 'icon',
                            class: 'h-8 w-full',
                          })}
                          onClick={() => selectPeriod(period)}
                        >
                          {period}
                        </button>
                      )}
                    </For>
                  </div>
                </ScrollArea>
              </Show>
            </div>
          </div>
        )
      }}
    </DatePickerContext>
  )
}

export const DateTimePicker = (props: DateTimePickerProps) => {
  const [local, rest] = splitProps(props, [
    'class',
    'hourCycle',
    'minuteStep',
    'placeholder',
    'rangeStartPlaceholder',
    'rangeEndPlaceholder',
    'clearable',
    'contentClass',
    'format',
    'locale',
    'showMonthYearSelect',
  ])

  const globalLocale = useLocale()
  const componentClass = useComponentClass(ComponentName.DateTimePicker, props)

  const resolvedHourCycle = createMemo<DateTimePickerHourCycle>(() =>
    local.hourCycle === 24 ? 24 : 12,
  )
  const resolvedMinuteStep = createMemo(() => normalizeMinuteStep(local.minuteStep))

  const defaultPlaceholder = createMemo(() =>
    resolvedHourCycle() === 24 ? 'MM/DD/YYYY HH:mm' : 'MM/DD/YYYY hh:mm aa',
  )

  const defaultFormat = (date: DateValue) => {
    const dateParts = getDateParts(date)
    if (!dateParts) {
      return date.toString()
    }

    const time = resolveTimeForValue(date) ?? { hour: 0, minute: 0 }
    const parsedDate = new Date(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      time.hour,
      time.minute,
    )

    return new Intl.DateTimeFormat(local.locale ?? globalLocale.locale ?? 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: resolvedHourCycle() === 12,
    }).format(parsedDate)
  }

  const [activeRangeIndex, setActiveRangeIndex] = createSignal(0)
  const [timeByDateKey, setTimeByDateKey] = createSignal<
    Record<string, { hour: number; minute: number }>
  >({})

  const resolveTimeForValue = (value?: DateValue) => {
    const valueTime = getDateValueTime(value)
    if (valueTime) {
      return valueTime
    }

    const key = getDateKey(value)
    if (!key) {
      return null
    }

    return timeByDateKey()[key] ?? null
  }

  const setTimeForValue = (value: DateValue, time: { hour: number; minute: number }) => {
    const key = getDateKey(value)
    if (!key) {
      return
    }

    setTimeByDateKey(prev => ({
      ...prev,
      [key]: time,
    }))
  }

  return (
    <DatePicker
      data-slot="date-time-picker"
      class={cx(componentClass, local.class)}
      closeOnSelect={rest.closeOnSelect ?? false}
      locale={local.locale ?? globalLocale.locale ?? 'en-US'}
      format={local.format ?? defaultFormat}
      {...rest}
    >
      <Show when={!rest.inline}>
        <DatePickerControl>
          <Show
            when={rest.selectionMode === 'range'}
            fallback={<DatePickerInput placeholder={local.placeholder ?? defaultPlaceholder()} />}
          >
            <DatePickerInput
              index={0}
              placeholder={local.rangeStartPlaceholder ?? local.placeholder ?? defaultPlaceholder()}
              onFocus={() => {
                setActiveRangeIndex(0)
              }}
            />
            <DatePickerInput
              index={1}
              placeholder={local.rangeEndPlaceholder ?? local.placeholder ?? defaultPlaceholder()}
              onFocus={() => {
                setActiveRangeIndex(1)
              }}
            />
          </Show>
          <Show when={local.clearable}>
            <DatePickerClearTrigger
              class={cx(
                'flex items-center justify-center min-w-9 min-h-9 border border-border bg-background hover:bg-accent/50 [&>svg]:size-4 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </DatePickerClearTrigger>
          </Show>
          <DatePickerTrigger />
        </DatePickerControl>

        <DatePickerPositioner>
          <DatePickerContent class={local.contentClass}>
            <div class="flex flex-col gap-3 lg:flex-row">
              <CalendarViews showMonthYearSelect={local.showMonthYearSelect} />
              <TimePanel
                hourCycle={resolvedHourCycle()}
                minuteStep={resolvedMinuteStep()}
                activeRangeIndex={activeRangeIndex()}
                onActiveRangeIndexChange={index => {
                  setActiveRangeIndex(index)
                }}
                resolveTimeForValue={resolveTimeForValue}
                setTimeForValue={setTimeForValue}
              />
            </div>
          </DatePickerContent>
        </DatePickerPositioner>
      </Show>

      <Show when={rest.inline}>
        <DatePickerContent class={cx('shadow-none border-0 p-0', local.contentClass)}>
          <div class="flex flex-col gap-3 lg:flex-row">
            <CalendarViews showMonthYearSelect={local.showMonthYearSelect} />
            <TimePanel
              hourCycle={resolvedHourCycle()}
              minuteStep={resolvedMinuteStep()}
              activeRangeIndex={activeRangeIndex()}
              onActiveRangeIndexChange={index => {
                setActiveRangeIndex(index)
              }}
              resolveTimeForValue={resolveTimeForValue}
              setTimeForValue={setTimeForValue}
            />
          </div>
        </DatePickerContent>
      </Show>
    </DatePicker>
  )
}
