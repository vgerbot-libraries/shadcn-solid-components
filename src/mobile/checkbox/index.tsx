import {
  CheckboxControl,
  CheckboxInput,
  CheckboxLabel,
  Checkbox as CheckboxPrimitive,
} from 'shadcn-solid-components/components/checkbox'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type Accessor,
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  mergeProps,
  Show,
  splitProps,
  untrack,
  useContext,
} from 'solid-js'

// ============================================================================
// Types
// ============================================================================

export type CheckboxValue = string | number

export interface CheckboxProps extends Omit<ComponentProps<'label'>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  value?: CheckboxValue
  disabled?: boolean
  onChange?: (checked: boolean, value?: CheckboxValue) => void
}

export interface CheckboxGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: CheckboxValue[]
  defaultValue?: CheckboxValue[]
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  onChange?: (value: CheckboxValue[]) => void
}

// ============================================================================
// Context
// ============================================================================

interface CheckboxGroupContextValue {
  value: Accessor<CheckboxValue[]>
  disabled: Accessor<boolean>
  toggle: (value: CheckboxValue) => void
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>()

// ============================================================================
// Checkbox
// ============================================================================

export const Checkbox = (props: CheckboxProps) => {
  const merge = mergeProps({ defaultChecked: false } as CheckboxProps, props)
  const [local, rest] = splitProps(merge, [
    'class',
    'checked',
    'defaultChecked',
    'value',
    'disabled',
    'onChange',
    'children',
  ])
  const componentClass = useComponentClass(ComponentName.MobileCheckbox, props)
  const group = useContext(CheckboxGroupContext)

  const isControlled = () => local.checked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = createSignal(
    untrack(() => local.defaultChecked ?? false),
  )

  const isDisabled = () => local.disabled || group?.disabled() === true
  const currentChecked = createMemo(() => {
    if (group && local.value !== undefined) {
      return group.value().includes(local.value)
    }

    return isControlled() ? Boolean(local.checked) : uncontrolledChecked()
  })

  const handleChange = (next: boolean) => {
    if (isDisabled()) {
      return
    }

    if (group && local.value !== undefined) {
      group.toggle(local.value)
      return
    }

    if (!isControlled()) {
      setUncontrolledChecked(next)
    }

    local.onChange?.(next, local.value)
  }

  return (
    <CheckboxPrimitive
      {...rest}
      data-slot="mobile-checkbox"
      checked={currentChecked()}
      disabled={isDisabled()}
      class={cx(
        'inline-flex min-h-11 items-center gap-2.5',
        isDisabled() && 'pointer-events-none opacity-50',
        componentClass,
        local.class,
      )}
      onChange={handleChange}
    >
      <CheckboxInput />
      <CheckboxControl
        data-slot="mobile-checkbox-control"
        class="border-muted-foreground/50 size-[17px] rounded-full data-[checked]:bg-primary data-[checked]:text-primary-foreground"
      />
      <Show when={local.children}>
        <CheckboxLabel
          data-slot="mobile-checkbox-label"
          class="text-[15px] leading-none font-normal"
        >
          {local.children}
        </CheckboxLabel>
      </Show>
    </CheckboxPrimitive>
  )
}

// ============================================================================
// CheckboxGroup
// ============================================================================

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const merge = mergeProps(
    {
      defaultValue: [] as CheckboxValue[],
      orientation: 'horizontal' as const,
    },
    props,
  )
  const [local, rest] = splitProps(merge, [
    'class',
    'value',
    'defaultValue',
    'orientation',
    'disabled',
    'onChange',
    'children',
  ])
  const componentClass = useComponentClass(
    ComponentName.MobileCheckbox,
    props as unknown as CheckboxProps,
  )

  const isControlled = () => local.value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = createSignal<CheckboxValue[]>(
    untrack(() => local.defaultValue ?? []),
  )
  const currentValue = createMemo(() =>
    isControlled() ? (local.value ?? []) : uncontrolledValue(),
  )

  const toggle = (value: CheckboxValue) => {
    if (local.disabled) {
      return
    }

    const current = currentValue()
    const next = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]

    if (!isControlled()) {
      setUncontrolledValue(next)
    }

    local.onChange?.(next)
  }

  return (
    <CheckboxGroupContext.Provider
      value={{
        value: currentValue,
        disabled: () => Boolean(local.disabled),
        toggle,
      }}
    >
      <div
        data-slot="mobile-checkbox-group"
        class={cx(
          'flex',
          local.orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4',
          componentClass,
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </div>
    </CheckboxGroupContext.Provider>
  )
}
