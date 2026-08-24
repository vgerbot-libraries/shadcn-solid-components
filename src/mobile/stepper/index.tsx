import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
} from 'shadcn-solid-components/components/number-field'
import type { QuantityStepperLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createMemo,
  createSignal,
  mergeProps,
  splitProps,
  untrack,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface QuantityStepperProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange?: (value: number) => void
}

// ============================================================================
// Component
// ============================================================================

export const QuantityStepper = (props: QuantityStepperProps) => {
  const merge = mergeProps({ min: 1, step: 1 } as QuantityStepperProps, props)
  const [local, rest] = splitProps(merge, [
    'class',
    'value',
    'defaultValue',
    'min',
    'max',
    'step',
    'disabled',
    'onChange',
  ])
  const componentClass = useComponentClass(ComponentName.QuantityStepper, props)

  const locale = (): QuantityStepperLocale => ({
    ...defaultLocale,
    ...useLocale().QuantityStepper,
  })

  const min = () => local.min ?? 1
  const isControlled = () => local.value !== undefined
  const initialValue = untrack(() => {
    const start = local.defaultValue ?? min()
    return local.max === undefined
      ? Math.max(start, min())
      : Math.min(Math.max(start, min()), local.max)
  })
  const [uncontrolledValue, setUncontrolledValue] = createSignal(initialValue)
  const [lastValid, setLastValid] = createSignal(initialValue)
  const [typedValue, setTypedValue] = createSignal<number>()

  const currentValue = createMemo(() =>
    isControlled() ? (local.value ?? min()) : uncontrolledValue(),
  )

  const clamp = (value: number) => {
    const next = Math.max(value, min())
    return local.max === undefined ? next : Math.min(next, local.max)
  }

  const commit = (value: number) => {
    const previous = currentValue()
    const next = clamp(value)
    if (!isControlled()) {
      setUncontrolledValue(next)
    }

    setLastValid(next)
    if (next !== previous) {
      local.onChange?.(next)
    }
  }
  const handleRawValueChange = (value: number) => {
    if (Number.isNaN(value)) {
      return
    }

    setTypedValue(value)
    if (value < min() || (local.max !== undefined && value > local.max)) {
      return
    }

    commit(value)
  }

  return (
    <div
      data-slot="quantity-stepper"
      class={cx('inline-flex items-center', componentClass, local.class)}
      {...rest}
    >
      <NumberField
        value={String(currentValue())}
        minValue={min()}
        maxValue={local.max}
        step={local.step}
        disabled={local.disabled}
        format={false}
        class="gap-0"
        onRawValueChange={handleRawValueChange}
      >
        <NumberFieldGroup class="flex items-center border-0 shadow-none ring-0 focus-within:ring-0">
          <NumberFieldDecrementTrigger
            data-slot="quantity-stepper-decrement"
            aria-label={locale().decrement}
            class="text-foreground relative top-auto left-auto size-6 translate-y-0 p-0 disabled:opacity-40"
          />
          <NumberFieldInput
            data-slot="quantity-stepper-input"
            class="h-6 w-[50px] px-0 py-0 text-center text-[13px] shadow-none md:text-[13px]"
            onChange={() => {
              const typed = typedValue()
              if (typed === undefined || Number.isNaN(typed)) {
                commit(lastValid())
                return
              }

              commit(typed)
              setTypedValue(undefined)
            }}
          />
          <NumberFieldIncrementTrigger
            data-slot="quantity-stepper-increment"
            aria-label={locale().increment}
            class="text-foreground relative top-auto right-auto size-6 translate-y-0 p-0 disabled:opacity-40"
          />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
