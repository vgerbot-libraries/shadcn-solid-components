import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
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
} from '@/components/date-picker'
import { buttonVariants } from '@/components/button'
import { cx } from '@/lib/cva'

// ============================================================================
// Locale
// ============================================================================

export interface DatePickerFieldLocale {
  placeholder: string
  rangePlaceholder: string
  clear: string
}

export const enLocale: DatePickerFieldLocale = {
  placeholder: 'Pick a date',
  rangePlaceholder: 'Pick a date range',
  clear: 'Clear',
}

export const zhCNLocale: DatePickerFieldLocale = {
  placeholder: '选择日期',
  rangePlaceholder: '选择日期范围',
  clear: '清除',
}

export const zhTWLocale: DatePickerFieldLocale = {
  placeholder: '選擇日期',
  rangePlaceholder: '選擇日期範圍',
  clear: '清除',
}

export const jaLocale: DatePickerFieldLocale = {
  placeholder: '日付を選択',
  rangePlaceholder: '日付範囲を選択',
  clear: 'クリア',
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
  | 'name'
  | 'timeZone'
  | 'locale'
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
}

// ============================================================================
// Internal: Calendar views
// ============================================================================

function CalendarViews() {
  return (
    <DatePickerContext>
      {(api) => (
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
                    {(weekDay) => (
                      <DatePickerTableHeader>{weekDay.short}</DatePickerTableHeader>
                    )}
                  </For>
                </DatePickerTableRow>
              </DatePickerTableHead>
              <DatePickerTableBody>
                <For each={api().weeks}>
                  {(week) => (
                    <DatePickerTableRow>
                      <For each={week}>
                        {(day) => (
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
      )}
    </DatePickerContext>
  )
}

// ============================================================================
// Internal: Calendar panel with optional presets sidebar
// ============================================================================

function CalendarPanel(props: { presets?: DatePickerPreset[]; hasPresets: boolean }) {
  return (
    <Show
      when={props.hasPresets}
      fallback={<CalendarViews />}
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
        <div>
          <CalendarViews />
        </div>
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
      'name',
      'timeZone',
      'locale',
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
    (rootProps.selectionMode === 'range' ? i18n().rangePlaceholder : i18n().placeholder)

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
        placeholder={placeholderText()}
        aria-invalid={hasError() || undefined}
      >
        <Show when={!rootProps.inline}>
          <DatePickerControl>
            <DatePickerInput />
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
              <CalendarPanel presets={local.presets} hasPresets={hasPresets()} />
            </DatePickerContent>
          </DatePickerPositioner>
        </Show>

        <Show when={rootProps.inline}>
          <DatePickerContent class={cx('shadow-none border-0 p-0', local.contentClass)}>
            <CalendarPanel presets={local.presets} hasPresets={hasPresets()} />
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
