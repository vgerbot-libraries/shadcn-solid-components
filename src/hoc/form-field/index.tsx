import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import { cx } from '@/lib/cva'

// ============================================================================
// Types
// ============================================================================

export interface FormFieldProps extends ComponentProps<'div'> {
  /** Field label text. */
  label?: string
  /** Accessible `id` linking the label to the input. Auto-generated if omitted. */
  htmlFor?: string
  /** Show a required indicator (*) next to the label. */
  required?: boolean
  /** Validation error message. When present, the field is rendered in the error state. */
  error?: string | string[]
  /** Help text shown below the input (hidden when `error` is present). */
  description?: string | JSX.Element
  /** The input element(s) rendered inside the field. */
  children: JSX.Element
  /** Extra class applied to the outer wrapper. */
  class?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * A uniform wrapper for form fields providing label, required indicator,
 * validation error and description.
 *
 * @example
 * ```tsx
 * <FormField label="Email" required error={errors().email}>
 *   <TextFieldInput type="email" placeholder="you@example.com" />
 * </FormField>
 * ```
 */
export function FormField(props: FormFieldProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'label',
    'htmlFor',
    'required',
    'error',
    'description',
    'children',
  ])

  const hasError = () => {
    if (Array.isArray(local.error)) return local.error.length > 0
    return !!local.error
  }

  const errorMessages = () => {
    if (!local.error) return []
    return Array.isArray(local.error) ? local.error : [local.error]
  }

  return (
    <div
      data-slot="form-field"
      data-invalid={hasError() || undefined}
      class={cx('grid w-full gap-2', local.class)}
      {...rest}
    >
      <Show when={local.label}>
        <label
          for={local.htmlFor}
          class={cx('text-sm font-medium select-none', hasError() && 'text-destructive')}
        >
          {local.label}
          <Show when={local.required}>
            <span class="text-destructive ml-0.5">*</span>
          </Show>
        </label>
      </Show>

      {local.children}

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
