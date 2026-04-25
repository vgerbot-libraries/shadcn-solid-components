import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, splitProps } from 'solid-js'
import { parseColor } from './color-utils'
import type { HSVA } from './color-utils'

export interface ColorSwatchesProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  colors: string[]
  hsva: HSVA
  disabled?: boolean
  onChange?: (hsva: HSVA) => void
}

export const ColorSwatches = (props: ColorSwatchesProps) => {
  const [local, rest] = splitProps(props, ['class', 'colors', 'hsva', 'disabled', 'onChange'])

  const isSelected = (color: string) => {
    const parsed = parseColor(color)
    if (!parsed) return false
    return (
      Math.round(parsed.h) === Math.round(local.hsva.h) &&
      Math.abs(parsed.s - local.hsva.s) < 0.01 &&
      Math.abs(parsed.v - local.hsva.v) < 0.01
    )
  }

  return (
    <div
      data-slot="color-picker-swatches"
      class={cx('grid grid-cols-8 gap-1.5', local.class)}
      {...rest}
    >
      {local.colors.map(color => (
        <button
          type="button"
          class={cx(
            'size-5 rounded-component border transition-shadow',
            isSelected(color) ? 'border-primary ring-2 ring-primary/30' : 'border-border',
            local.disabled && 'pointer-events-none opacity-50',
          )}
          style={{ 'background-color': color }}
          disabled={local.disabled}
          onClick={() => {
            const parsed = parseColor(color)
            if (parsed) {
              local.onChange?.({ ...parsed, a: local.hsva.a })
            }
          }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  )
}
