import type { DatePickerRootProps } from '@ark-ui/solid/date-picker'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  DateTimePicker,
  type DateTimePickerPreset,
} from 'shadcn-solid-components/components/date-time-picker'
import type { DateTimePickerFieldLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

export type { DateValue } from '@ark-ui/solid/date-picker'
export type {
  DateRangePreset,
  DateTimePickerPreset,
} from 'shadcn-solid-components/components/date-time-picker'

// ============================================================================
// Types
// ============================================================================

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

export interface DateTimePickerFieldProps
  extends Omit<ComponentProps<'div'>, 'onChange'>,
    PickedRootProps {
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
  /** Range mode start placeholder override. */
  rangeStartPlaceholder?: string
  /** Range mode end placeholder override. */
  rangeEndPlaceholder?: string
  /** Show a clear button. @default false */
  clearable?: boolean
  /** Class applied to the calendar content panel. */
  contentClass?: string
  /** 12h or 24h hour cycle. @default 12 */
  hourCycle?: 12 | 24
  /** Minute selection step (1–30). @default 1 */
  minuteStep?: number
  /** Show Month/Year dropdown selects in the day-view header. @default false */
  showMonthYearSelect?: boolean
  /** Preset options displayed as quick-select buttons alongside the calendar. */
  presets?: DateTimePickerPreset[]
  /** Show a "Today" button below the calendar. @default false */
  showTodayButton?: boolean
  /** Custom JSX rendered above the calendar views inside the content panel. */
  calendarHeader?: JSX.Element
  /** Custom JSX rendered below the calendar views inside the content panel. */
  calendarFooter?: JSX.Element
  /** i18n text overrides for HOC-level strings. */
  i18n?: Partial<DateTimePickerFieldLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A pre-composed datetime picker with input, calendar + time panel, and
 * optional form-field integration (label, description, error).
 *
 * Wraps the lower-level `DateTimePicker` component so you don't have to
 * assemble the control, content, and time panel manually.
 *
 * @example
 * ```tsx
 * <DateTimePickerField />
 * ```
 *
 * @example
 * ```tsx
 * <DateTimePickerField
 *   label="Appointment"
 *   required
 *   description="Select your preferred date and time."
 *   hourCycle={24}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DateTimePickerField
 *   label="Schedule Range"
 *   selectionMode="range"
 *   hourCycle={24}
 *   presets={[
 *     { label: "Last 7 Days", value: "last7Days" },
 *     { label: "Last 30 Days", value: "last30Days" },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DateTimePickerField inline hourCycle={24} />
 * ```
 */
export function DateTimePickerField(props: DateTimePickerFieldProps) {
  const [local, rootProps, rest] = splitProps(
    props,
    [
      'class',
      'label',
      'description',
      'error',
      'required',
      'placeholder',
      'rangeStartPlaceholder',
      'rangeEndPlaceholder',
      'clearable',
      'contentClass',
      'hourCycle',
      'minuteStep',
      'showMonthYearSelect',
      'presets',
      'showTodayButton',
      'calendarHeader',
      'calendarFooter',
      'i18n',
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

  const globalLocale = useLocale()
  const i18n = (): DateTimePickerFieldLocale => ({
    ...defaultLocale,
    ...globalLocale.DateTimePickerField,
    ...local.i18n,
  })

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

  return (
    <div
      data-slot="date-time-picker-field"
      data-invalid={hasError() || undefined}
      class={cx('grid w-full gap-2', local.class)}
      {...rest}
    >
      <Show when={local.label}>
        {typeof local.label === 'string' ? (
          <label class={cx('text-sm font-medium select-none', hasError() && 'text-destructive')}>
            {local.label}
            <Show when={local.required}>
              <span class="text-destructive ml-0.5">*</span>
            </Show>
          </label>
        ) : (
          local.label
        )}
      </Show>

      <DateTimePicker
        {...rootProps}
        invalid={hasError() || undefined}
        required={local.required}
        placeholder={placeholderText()}
        rangeStartPlaceholder={local.rangeStartPlaceholder ?? i18n().rangeStartPlaceholder}
        rangeEndPlaceholder={local.rangeEndPlaceholder ?? i18n().rangeEndPlaceholder}
        clearable={local.clearable}
        contentClass={local.contentClass}
        hourCycle={local.hourCycle}
        minuteStep={local.minuteStep}
        showMonthYearSelect={local.showMonthYearSelect}
        presets={local.presets}
        showTodayButton={local.showTodayButton}
        todayLabel={i18n().today}
        calendarHeader={local.calendarHeader}
        calendarFooter={local.calendarFooter}
      />

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
