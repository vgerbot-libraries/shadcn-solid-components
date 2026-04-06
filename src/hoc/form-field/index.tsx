import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createSignal,
  createUniqueId,
  type JSX,
  onMount,
  Show,
  splitProps,
} from 'solid-js'

// ============================================================================
// Types
// ============================================================================

export interface FormFieldProps extends ComponentProps<'div'> {
  /** Field label text, or a custom JSX element for complex label layouts. */
  label?: string | JSX.Element
  /**
   * Accessible `id` linking the label to the input.
   * When omitted, auto-detected from the first input element inside children.
   */
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
 * The label is automatically associated with the first `<input>`, `<textarea>`,
 * or `<select>` found inside children — no manual `id` / `htmlFor` needed.
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

  let containerRef: HTMLDivElement | undefined
  const autoId = createUniqueId()
  const [autoFor, setAutoFor] = createSignal<string>()

  onMount(() => {
    if (local.htmlFor || !local.label || !containerRef) return
    const input = containerRef.querySelector('input, textarea, select')
    if (!input) return
    if (!input.id) input.id = autoId
    const inputId = input.id

    if (typeof local.label === 'string') {
      setAutoFor(inputId)
    } else {
      for (const label of containerRef.querySelectorAll('label')) {
        if (!label.getAttribute('for')) label.setAttribute('for', inputId)
      }
    }
  })

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
      ref={containerRef}
    >
      <Show when={local.label}>
        {typeof local.label === 'string' ? (
          <label
            for={local.htmlFor ?? autoFor()}
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
