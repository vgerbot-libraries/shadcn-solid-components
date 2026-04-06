import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  OTPFieldGroup as OTPFieldGroupBase,
  OTPFieldInput,
  OTPField as OTPFieldRoot,
  OTPFieldSeparator,
  OTPFieldSlot,
} from 'shadcn-solid-components/components/otp-field'
import type { OTPFieldLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, For, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface OTPFieldGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** Total number of character slots. */
  maxLength: number
  /**
   * How slots are grouped, e.g. `[3, 3]` creates two groups of 3
   * separated by a divider. Defaults to a single group of `maxLength`.
   */
  groupPattern?: number[]
  /** Show separators between groups. Defaults to `true` when multiple groups exist. */
  separator?: boolean
  /** Controlled value. */
  value?: string
  /** Called when the value changes. */
  onValueChange?: (value: string) => void
  /** Called when all slots are filled. */
  onComplete?: (value: string) => void
  /** Field label. */
  label?: string
  /** Help text shown below the field (hidden when `error` is present). */
  description?: string
  /** Validation error message. */
  error?: string
  /** Show a required indicator (*) next to the label. */
  required?: boolean
  /** Disabled state. */
  disabled?: boolean
  /**
   * Regex pattern for the input. `null` allows all characters.
   * @default `'^\\d*$'` (digits only)
   */
  pattern?: string | null
  /** Locale overrides. */
  locale?: Partial<OTPFieldLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A pre-composed OTP input field with automatic slot grouping,
 * separators, label, description, and validation error display.
 *
 * @example
 * ```tsx
 * <OTPFieldGroup maxLength={6} groupPattern={[3, 3]} />
 * ```
 *
 * @example
 * ```tsx
 * <OTPFieldGroup
 *   maxLength={4}
 *   label="Verification Code"
 *   description="Enter the 4-digit code sent to your phone."
 *   onComplete={(value) => verify(value)}
 * />
 * ```
 */
export function OTPFieldGroup(props: OTPFieldGroupProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'maxLength',
    'groupPattern',
    'separator',
    'value',
    'onValueChange',
    'onComplete',
    'label',
    'description',
    'error',
    'required',
    'disabled',
    'pattern',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): OTPFieldLocale => ({
    ...defaultLocale,
    ...globalLocale.OTPField,
    ...local.locale,
  })

  const groups = () => {
    const pattern = local.groupPattern
    if (!pattern || pattern.length === 0) return [local.maxLength]
    return pattern
  }

  const showSeparator = () => {
    if (local.separator !== undefined) return local.separator
    return groups().length > 1
  }

  const hasError = () => !!local.error

  const slotGroups = () => {
    const result: number[][] = []
    let offset = 0
    for (const size of groups()) {
      const group: number[] = []
      for (let i = 0; i < size; i++) {
        group.push(offset + i)
      }
      result.push(group)
      offset += size
    }
    return result
  }

  return (
    <div data-slot="otp-field-hoc" class={cx('grid w-full gap-2', local.class)} {...rest}>
      <Show when={local.label}>
        <label class={cx('text-sm font-medium select-none', hasError() && 'text-destructive')}>
          {local.label}
          <Show when={local.required}>
            <span class="text-destructive ml-0.5">*</span>
          </Show>
        </label>
      </Show>

      <OTPFieldRoot
        maxLength={local.maxLength}
        value={local.value}
        onValueChange={local.onValueChange}
        onComplete={local.onComplete}
        aria-label={local.label ?? locale().label}
        aria-invalid={hasError() || undefined}
      >
        <OTPFieldInput pattern={local.pattern} disabled={local.disabled} />
        <For each={slotGroups()}>
          {(group, groupIndex) => (
            <>
              <Show when={groupIndex() > 0 && showSeparator()}>
                <OTPFieldSeparator />
              </Show>
              <OTPFieldGroupBase>
                <For each={group}>{slotIndex => <OTPFieldSlot index={slotIndex} />}</For>
              </OTPFieldGroupBase>
            </>
          )}
        </For>
      </OTPFieldRoot>

      <Show when={hasError()}>
        <p class="text-destructive text-sm">{local.error}</p>
      </Show>

      <Show when={!hasError() && local.description}>
        <p class="text-muted-foreground text-sm">{local.description}</p>
      </Show>
    </div>
  )
}
