import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, splitProps } from 'solid-js'
import type { HSVA } from './color-utils'
import { clamp, hsvaToRgba } from './color-utils'

const CHECKERBOARD_PATTERN =
  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center'

export interface HueSliderProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  hue: number
  disabled?: boolean
  onChange?: (hue: number) => void
}

export const HueSlider = (props: HueSliderProps) => {
  const [local, rest] = splitProps(props, ['class', 'hue', 'disabled', 'onChange'])

  let trackRef: HTMLDivElement | undefined

  const updateHue = (event: PointerEvent) => {
    if (!trackRef) return

    const rect = trackRef.getBoundingClientRect()
    const x = clamp(event.clientX - rect.left, 0, rect.width)
    const nextH = rect.width === 0 ? 0 : (x / rect.width) * 360

    local.onChange?.(nextH)
  }

  const onPointerDown: ComponentProps<'div'>['onPointerDown'] = event => {
    if (local.disabled) return

    event.preventDefault()
    updateHue(event)

    const onPointerMove = (e: PointerEvent) => updateHue(e)
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const thumbLeft = () => `${(local.hue / 360) * 100}%`

  return (
    <div
      data-slot="color-picker-hue-slider"
      class={cx('relative h-3 w-full touch-none select-none', local.disabled && 'opacity-60', local.class)}
      {...rest}
    >
      <div
        ref={trackRef}
        class="h-full w-full cursor-pointer rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]"
        onPointerDown={onPointerDown}
      />
      <div
        class="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        style={{ left: thumbLeft(), background: `hsl(${Math.round(local.hue)} 100% 50%)` }}
      />
    </div>
  )
}

export interface AlphaSliderProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  hsva: HSVA
  disabled?: boolean
  onChange?: (alpha: number) => void
}

export const AlphaSlider = (props: AlphaSliderProps) => {
  const [local, rest] = splitProps(props, ['class', 'hsva', 'disabled', 'onChange'])

  let trackRef: HTMLDivElement | undefined

  const updateAlpha = (event: PointerEvent) => {
    if (!trackRef) return

    const rect = trackRef.getBoundingClientRect()
    const x = clamp(event.clientX - rect.left, 0, rect.width)
    const nextA = rect.width === 0 ? 0 : x / rect.width

    local.onChange?.(nextA)
  }

  const onPointerDown: ComponentProps<'div'>['onPointerDown'] = event => {
    if (local.disabled) return

    event.preventDefault()
    updateAlpha(event)

    const onPointerMove = (e: PointerEvent) => updateAlpha(e)
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const rgba = () => hsvaToRgba(local.hsva)
  const alphaBackground = () => {
    const c = rgba()
    return `linear-gradient(to right, rgba(${c.r}, ${c.g}, ${c.b}, 0), rgba(${c.r}, ${c.g}, ${c.b}, 1))`
  }
  const thumbLeft = () => `${local.hsva.a * 100}%`
  const thumbColor = () => {
    const c = rgba()
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${local.hsva.a})`
  }

  return (
    <div
      data-slot="color-picker-alpha-slider"
      class={cx('relative h-3 w-full touch-none select-none', local.disabled && 'opacity-60', local.class)}
      {...rest}
    >
      <div
        ref={trackRef}
        class="relative h-full w-full cursor-pointer rounded-full overflow-hidden"
        onPointerDown={onPointerDown}
      >
        <div class="absolute inset-0 rounded-full" style={{ background: CHECKERBOARD_PATTERN, 'background-size': '8px 8px' }} />
        <div class="absolute inset-0 rounded-full" style={{ background: alphaBackground() }} />
      </div>
      <div
        class="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        style={{ left: thumbLeft(), background: thumbColor() }}
      />
    </div>
  )
}
