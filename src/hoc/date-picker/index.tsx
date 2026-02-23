import { type ComponentProps, For, type JSX, Match, Show, splitProps,Switch } from 'solid-js'
import { DatePicker as DatePickerPrimitive } from '@ark-ui/solid/date-picker'
import type { DatePickerRootProps } from '@ark-ui/solid/date-picker'
export type { DateValue } from '@ark-ui/solid/date-picker'
import type { DateValue } from '@ark-ui/solid/date-picker'
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
} from '@/components/date-picker'
import { Badge } from '@/components/badge'
import { buttonVariants } from '@/components/button'
import { cx } from '@/lib/cva'
import { IconX } from '@/components/icons';

// ============================================================================
// Locale
// ============================================================================

export interface DatePickerFieldLocale {
  placeholder: string
  rangePlaceholder: string
  multiplePlaceholder: string
  clear: string
  today: string
}

export const enLocale: DatePickerFieldLocale = {
  placeholder: 'Pick a date',
  rangePlaceholder: 'Pick a date range',
  multiplePlaceholder: 'Pick dates',
  clear: 'Clear',
  today: 'Today',
}

export const zhCNLocale: DatePickerFieldLocale = {
  placeholder: '选择日期',
  rangePlaceholder: '选择日期范围',
  multiplePlaceholder: '选择多个日期',
  clear: '清除',
  today: '今天',
}

export const zhTWLocale: DatePickerFieldLocale = {
  placeholder: '選擇日期',
  rangePlaceholder: '選擇日期範圍',
  multiplePlaceholder: '選擇多個日期',
  clear: '清除',
  today: '今天',
}

export const jaLocale: DatePickerFieldLocale = {
  placeholder: '日付を選択',
  rangePlaceholder: '日付範囲を選択',
  multiplePlaceholder: '複数の日付を選択',
  clear: 'クリア',
  today: '今日',
}

// ============================================================================
// Types
// ============================================================================

export type DateRangePreset =
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'thisYear'
  | 'lastYear'
  | 'last3Days'
  | 'last7Days'
  | 'last14Days'
  | 'last30Days'
  | 'last90Days'

export interface DatePickerPreset {
  label: string
  value: DateValue[] | DateRangePreset
}

type PickedRootProps = Pick<
  DatePickerRootProps,
  | 'selectionMode'
  | 'value'
  | 'defaultValue'
  | 'focusedValue'
  | 'defaultFocusedValue'
  | 'onValueChange'
  | 'onFocusChange'
  | 'onViewChange'
  | 'onOpenChange'
  | 'min'
  | 'max'
  | 'disabled'
  | 'readOnly'
  | 'isDateUnavailable'
  | 'numOfMonths'
  | 'fixedWeeks'
  | 'startOfWeek'
  | 'closeOnSelect'
  | 'positioning'
  | 'open'
  | 'defaultOpen'
  | 'inline'
  | 'format'
  | 'parse'
  | 'name'
  | 'timeZone'
  | 'locale'
  | 'defaultView'
  | 'view'
  | 'minView'
  | 'maxView'
  | 'outsideDaySelectable'
  | 'translations'
  | 'ids'
>

export interface DatePickerFieldProps extends Omit<ComponentProps<'div'>, 'onChange'>, PickedRootProps {
  /** Field label. */
  label?: string | JSX.Element
  /** Help text shown below the input (hidden when `error` is present). */
  description?: string | JSX.Element
  /** Validation error message. */
  error?: string | string[]
  /** Show a required indicator (*) next to the label. */
  required?: boolean
  /** Input placeholder override. */
  placeholder?: string
  /** Show a clear button. @default false */
  clearable?: boolean
  /** Preset options displayed as quick-select buttons alongside the calendar. */
  presets?: DatePickerPreset[]
  /** i18n text overrides for HOC-level strings. */
  i18n?: Partial<DatePickerFieldLocale>
  /** Class applied to the calendar content panel. */
  contentClass?: string
  /** Show Month/Year dropdown selects in the day-view header for quick navigation. @default false */
  showMonthYearSelect?: boolean
  /** Show a "Today" button below the calendar. @default false */
  showTodayButton?: boolean
  /** Custom JSX rendered above the calendar views inside the content panel. */
  calendarHeader?: JSX.Element
  /** Custom JSX rendered below the calendar views inside the content panel. */
  calendarFooter?: JSX.Element
}

// ============================================================================
// Internal: Calendar views
// ============================================================================

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
            {(weekDay) => (
              <DatePickerTableHeader>{weekDay.short}</DatePickerTableHeader>
            )}
          </For>
        </DatePickerTableRow>
      </DatePickerTableHead>
      <DatePickerTableBody>
        <For each={props.weeks}>
          {(week) => (
            <DatePickerTableRow>
              <For each={week}>
                {(day) => (
                  <DatePickerTableCell value={day} visibleRange={props.visibleRange}>
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
  )
}

const selectClass = 'appearance-none border border-border rounded-md bg-background px-2 py-1 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring'

function CalendarViews(props: { showMonthYearSelect?: boolean }) {
  return (
    <DatePickerContext>
      {(api) => {
        const numOfMonths = () => api().numOfMonths ?? 1
        const monthOffsets = () =>
          Array.from({ length: numOfMonths() }, (_, i) => i)
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
                  {(monthIndex) => {
                    const offset = () =>
                      monthIndex === 0
                        ? { weeks: api().weeks, visibleRange: api().visibleRange }
                        : api().getOffset({ months: monthIndex })
                    return (
                      <div
                        class={cx(
                          numOfMonths() > 1 &&
                            'min-w-[calc(var(--reference-width)-(0.75rem*2))]',
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

          <DatePickerView view="month">
            <DatePickerViewControl>
              <DatePickerViewTrigger>
                <DatePickerRangeText />
              </DatePickerViewTrigger>
            </DatePickerViewControl>
            <DatePickerTable>
              <DatePickerTableBody>
                <For each={api().getMonthsGrid({ columns: 4, format: 'short' })}>
                  {(months) => (
                    <DatePickerTableRow>
                      <For each={months}>
                        {(month) => (
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
                  {(years) => (
                    <DatePickerTableRow>
                      <For each={years}>
                        {(year) => (
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
      )}}
    </DatePickerContext>
  )
}

// ============================================================================
// Internal: Calendar panel with optional presets sidebar
// ============================================================================

function TodayButton(props: { label: string }) {
  return (
    <DatePickerContext>
      {(api) => (
        <button
          type="button"
          class={cx(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full mt-2',
          )}
          onClick={() => api().selectToday()}
        >
          {props.label}
        </button>
      )}
    </DatePickerContext>
  )
}

interface CalendarPanelProps {
  presets?: DatePickerPreset[]
  hasPresets: boolean
  showMonthYearSelect?: boolean
  showTodayButton?: boolean
  todayLabel: string
  calendarHeader?: JSX.Element
  calendarFooter?: JSX.Element
}

function CalendarPanel(props: CalendarPanelProps) {
  const calendarContent = () => (
    <div>
      {props.calendarHeader}
      <CalendarViews showMonthYearSelect={props.showMonthYearSelect} />
      <Show when={props.showTodayButton}>
        <TodayButton label={props.todayLabel} />
      </Show>
      {props.calendarFooter}
    </div>
  )

  return (
    <Show
      when={props.hasPresets}
      fallback={calendarContent()}
    >
      <div class="flex gap-3">
        <div class="flex flex-col gap-1 border-r pr-3">
          <For each={props.presets}>
            {(preset) => (
              <DatePickerPrimitive.PresetTrigger
                value={preset.value}
                class={cx(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start h-8 px-3 text-sm font-normal',
                )}
              >
                {preset.label}
              </DatePickerPrimitive.PresetTrigger>
            )}
          </For>
        </div>
        {calendarContent()}
      </div>
    </Show>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A pre-composed date picker with input, calendar popover, presets,
 * and optional form-field integration (label, description, error).
 *
 * Wraps the lower-level `DatePicker*` primitives so you don't have to
 * assemble day/month/year views manually.
 *
 * @example
 * ```tsx
 * <DatePickerField />
 * ```
 *
 * @example
 * ```tsx
 * <DatePickerField
 *   label="Birthday"
 *   required
 *   description="Select your date of birth."
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DatePickerField
 *   selectionMode="range"
 *   presets={[
 *     { label: "Last 7 Days", value: "last7Days" },
 *     { label: "Last 30 Days", value: "last30Days" },
 *     { label: "This Month", value: "thisMonth" },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DatePickerField inline />
 * ```
 */
export function DatePickerField(props: DatePickerFieldProps) {
  const [local, rootProps, rest] = splitProps(
    props,
    [
      'class',
      'label',
      'description',
      'error',
      'required',
      'placeholder',
      'clearable',
      'presets',
      'i18n',
      'contentClass',
      'showMonthYearSelect',
      'showTodayButton',
      'calendarHeader',
      'calendarFooter',
    ],
    [
      'selectionMode',
      'value',
      'defaultValue',
      'focusedValue',
      'defaultFocusedValue',
      'onValueChange',
      'onFocusChange',
      'onViewChange',
      'onOpenChange',
      'min',
      'max',
      'disabled',
      'readOnly',
      'isDateUnavailable',
      'numOfMonths',
      'fixedWeeks',
      'startOfWeek',
      'closeOnSelect',
      'positioning',
      'open',
      'defaultOpen',
      'inline',
      'format',
      'parse',
      'name',
      'timeZone',
      'locale',
      'defaultView',
      'view',
      'minView',
      'maxView',
      'outsideDaySelectable',
      'translations',
      'ids',
    ],
  )

  const i18n = (): DatePickerFieldLocale => ({ ...enLocale, ...local.i18n })

  const hasError = () => {
    if (Array.isArray(local.error)) return local.error.length > 0
    return !!local.error
  }

  const errorMessages = () => {
    if (!local.error) return []
    return Array.isArray(local.error) ? local.error : [local.error]
  }

  const placeholderText = () =>
    local.placeholder ??
    (rootProps.selectionMode === 'range'
      ? i18n().rangePlaceholder
      : rootProps.selectionMode === 'multiple'
        ? i18n().multiplePlaceholder
        : i18n().placeholder)

  const hasPresets = () => !!local.presets && local.presets.length > 0

  return (
    <div
      data-slot="date-picker-field"
      data-invalid={hasError() || undefined}
      class={cx('grid w-full gap-2', local.class)}
      {...rest}
    >
      <Show when={local.label}>
        {typeof local.label === 'string' ? (
          <label
            class={cx('text-sm font-medium select-none', hasError() && 'text-destructive')}
          >
            {local.label}
            <Show when={local.required}>
              <span class="text-destructive ml-0.5">*</span>
            </Show>
          </label>
        ) : (
          local.label
        )}
      </Show>

      <DatePicker
        {...rootProps}
        invalid={hasError() || undefined}
        required={local.required}
        placeholder={placeholderText()}
      >
        <Show when={!rootProps.inline}>
          <DatePickerControl>
            <Switch fallback={<DatePickerInput />}>
              <Match when={rootProps.selectionMode === 'range'}>
                <>
                  <DatePickerInput index={0} />
                  <DatePickerInput index={1} />
                </>
              </Match>
              <Match when={rootProps.selectionMode === 'multiple'}>
                <div class={cx(
                  'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-9 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                'rounded-component',
                "flex min-w-0 flex-1 flex-wrap items-center gap-1.5"
                )}
                >
                  <DatePickerPrimitive.ValueText placeholder={placeholderText()}>
                    {(props) => (
                      <Badge variant="outline" class="gap-1 pr-1">
                        {props.valueAsString}
                        <button
                          type="button"
                          class="hover:bg-muted rounded-sm p-0.5"
                          onClick={() => props.remove()}
                          aria-label={i18n().clear}
                        >
                          <IconX class="size-3"></IconX>
                        </button>
                      </Badge>
                    )}
                  </DatePickerPrimitive.ValueText>
                </div>
              </Match>
            </Switch>
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
              <CalendarPanel
                presets={local.presets}
                hasPresets={hasPresets()}
                showMonthYearSelect={local.showMonthYearSelect}
                showTodayButton={local.showTodayButton}
                todayLabel={i18n().today}
                calendarHeader={local.calendarHeader}
                calendarFooter={local.calendarFooter}
              />
            </DatePickerContent>
          </DatePickerPositioner>
        </Show>

        <Show when={rootProps.inline}>
          <DatePickerContent class={cx('shadow-none border-0 p-0', local.contentClass)}>
            <CalendarPanel
              presets={local.presets}
              hasPresets={hasPresets()}
              showMonthYearSelect={local.showMonthYearSelect}
              showTodayButton={local.showTodayButton}
              todayLabel={i18n().today}
              calendarHeader={local.calendarHeader}
              calendarFooter={local.calendarFooter}
            />
          </DatePickerContent>
        </Show>
      </DatePicker>

      <Show when={hasError()}>
        <div class="text-destructive text-sm">
          <Show when={errorMessages().length > 1} fallback={errorMessages()[0]}>
            <ul class="ml-4 list-disc">
              {errorMessages().map(msg => (
                <li>{msg}</li>
              ))}
            </ul>
          </Show>
        </div>
      </Show>

      <Show when={!hasError() && local.description}>
        <p class="text-muted-foreground text-sm">{local.description}</p>
      </Show>
    </div>
  )
}
