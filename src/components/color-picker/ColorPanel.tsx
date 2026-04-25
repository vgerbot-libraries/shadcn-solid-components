import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, splitProps } from 'solid-js'
import type { HSVA } from './color-utils'
import { clamp } from './color-utils'

export interface ColorPanelProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  hsva: HSVA
  disabled?: boolean
  onChange?: (hsva: HSVA) => void
}

export const ColorPanel = (props: ColorPanelProps) => {
  const [local, rest] = splitProps(props, ['class', 'hsva', 'disabled', 'onChange'])

  let boardRef: HTMLDivElement | undefined

  const updateSaturationAndValue = (event: PointerEvent) => {
    if (!boardRef) return

    const rect = boardRef.getBoundingClientRect()
    const x = clamp(event.clientX - rect.left, 0, rect.width)
    const y = clamp(event.clientY - rect.top, 0, rect.height)

    const nextS = rect.width === 0 ? 0 : x / rect.width
    const nextV = rect.height === 0 ? 0 : 1 - y / rect.height

    local.onChange?.({ ...local.hsva, s: nextS, v: nextV })
  }

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = event => {
    if (local.disabled) return

    event.preventDefault()
    updateSaturationAndValue(event)

    const onPointerMove = (e: PointerEvent) => updateSaturationAndValue(e)
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const hueBackground = () => `hsl(${Math.round(local.hsva.h)} 100% 50%)`

  return (
    <div
      data-slot="color-picker-panel"
      ref={boardRef}
      class={cx(
        'relative h-44 w-full cursor-crosshair overflow-hidden rounded-component',
        local.disabled && 'pointer-events-none opacity-60',
        local.class,
      )}
      style={{ 'background-color': hueBackground() }}
      onPointerDown={onPointerDown}
      {...rest}
    >
      <div class="absolute inset-0 bg-linear-to-r from-white to-transparent" />
      <div class="absolute inset-0 bg-linear-to-t from-black to-transparent" />
      <span
        data-slot="color-picker-panel-thumb"
        class="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_1px_rgba(0,0,0,0.1)]"
        style={{
          left: `${local.hsva.s * 100}%`,
          top: `${(1 - local.hsva.v) * 100}%`,
        }}
      />
    </div>
  )
}
