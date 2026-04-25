import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, createSignal, Show, splitProps } from 'solid-js'
import type { HSVA } from './color-utils'
import { hsvaToRgba, rgbaToHsva, parseColor, stringifyColor } from './color-utils'
import type { ColorFormat } from './color-utils'

export interface ColorInputProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  hsva: HSVA
  format: ColorFormat
  showAlpha: boolean
  disabled?: boolean
  onChange?: (hsva: HSVA) => void
  onFormatChange?: (format: ColorFormat) => void
}

const FORMAT_OPTIONS: { label: string; value: ColorFormat }[] = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'HSL', value: 'hsl' },
]

export const ColorInput = (props: ColorInputProps) => {
  const [local, rest] = splitProps(props, ['class', 'hsva', 'format', 'showAlpha', 'disabled', 'onChange', 'onFormatChange'])

  const [hexInput, setHexInput] = createSignal('')
  const [rInput, setRInput] = createSignal('')
  const [gInput, setGInput] = createSignal('')
  const [bInput, setBInput] = createSignal('')
  const [hInput, setHInput] = createSignal('')
  const [sInput, setSInput] = createSignal('')
  const [lInput, setLInput] = createSignal('')
  const [editing, setEditing] = createSignal(false)

  // Sync inputs from hsva when not editing
  const syncFromHsva = () => {
    if (editing()) return
    const rgba = hsvaToRgba(local.hsva)
    const text = stringifyColor(local.hsva, local.format, local.showAlpha)
    setHexInput(local.format === 'hex' ? text : stringifyColor(local.hsva, 'hex', local.showAlpha))
    setRInput(String(rgba.r))
    setGInput(String(rgba.g))
    setBInput(String(rgba.b))

    // HSL values
    const h = Math.round(local.hsva.h)
    // More accurate: compute from RGBA
    const max = Math.max(rgba.r, rgba.g, rgba.b) / 255
    const min = Math.min(rgba.r, rgba.g, rgba.b) / 255
    const lVal = (max + min) / 2
    const delta = max - min
    const sVal = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lVal - 1))
    setHInput(String(h))
    setSInput(String(Math.round(sVal * 100)))
    setLInput(String(Math.round(lVal * 100)))
  }

  // Call sync on every render
  syncFromHsva()

  const commitHex = () => {
    setEditing(false)
    const parsed = parseColor(hexInput())
    if (parsed) {
      local.onChange?.({ ...parsed, a: local.hsva.a })
    } else {
      // Reset to current
      setHexInput(stringifyColor(local.hsva, 'hex', local.showAlpha))
    }
  }

  const commitRgb = () => {
    setEditing(false)
    const r = Number.parseInt(rInput())
    const g = Number.parseInt(gInput())
    const b = Number.parseInt(bInput())
    if ([r, g, b].every(v => !Number.isNaN(v) && v >= 0 && v <= 255)) {
      const parsed = rgbaToHsva({ r, g, b, a: local.hsva.a })
      local.onChange?.(parsed)
    } else {
      const rgba = hsvaToRgba(local.hsva)
      setRInput(String(rgba.r))
      setGInput(String(rgba.g))
      setBInput(String(rgba.b))
    }
  }

  const commitHsl = () => {
    setEditing(false)
    const h = Number.parseFloat(hInput())
    const s = Number.parseFloat(sInput())
    const l = Number.parseFloat(lInput())
    if ([h, s, l].every(v => !Number.isNaN(v))) {
      const parsed = parseColor(`hsl(${h}, ${s}%, ${l}%)`)
      if (parsed) {
        local.onChange?.({ ...parsed, a: local.hsva.a })
      }
    }
  }

  const inputClass =
    'h-7 w-full min-w-0 rounded-md border border-input bg-background px-2 text-xs shadow-none focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div
      data-slot="color-picker-input"
      class={cx('flex flex-col gap-2', local.class)}
      {...rest}
    >
      {/* Format selector */}
      <div class="flex gap-1">
        {FORMAT_OPTIONS.map(opt => (
          <button
            type="button"
            class={cx(
              'h-6 rounded px-2 text-xs font-medium transition-colors',
              local.format === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
              local.disabled && 'pointer-events-none opacity-50',
            )}
            disabled={local.disabled}
            onClick={() => local.onFormatChange?.(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Input fields based on format */}
      <Show when={local.format === 'hex'}>
        <input
          type="text"
          class={inputClass}
          value={hexInput()}
          disabled={local.disabled}
          onInput={e => {
            setEditing(true)
            setHexInput(e.currentTarget.value)
          }}
          onBlur={commitHex}
          onKeyDown={e => {
            if (e.key === 'Enter') commitHex()
          }}
        />
      </Show>

      <Show when={local.format === 'rgb'}>
        <div class="grid grid-cols-3 gap-1">
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={rInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setRInput(e.currentTarget.value)
              }}
              onBlur={commitRgb}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRgb()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              R
            </span>
          </div>
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={gInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setGInput(e.currentTarget.value)
              }}
              onBlur={commitRgb}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRgb()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              G
            </span>
          </div>
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={bInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setBInput(e.currentTarget.value)
              }}
              onBlur={commitRgb}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRgb()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              B
            </span>
          </div>
        </div>
      </Show>

      <Show when={local.format === 'hsl'}>
        <div class="grid grid-cols-3 gap-1">
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={hInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setHInput(e.currentTarget.value)
              }}
              onBlur={commitHsl}
              onKeyDown={e => {
                if (e.key === 'Enter') commitHsl()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              H
            </span>
          </div>
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={sInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setSInput(e.currentTarget.value)
              }}
              onBlur={commitHsl}
              onKeyDown={e => {
                if (e.key === 'Enter') commitHsl()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              S
            </span>
          </div>
          <div class="relative">
            <input
              type="text"
              class={inputClass}
              value={lInput()}
              disabled={local.disabled}
              onInput={e => {
                setEditing(true)
                setLInput(e.currentTarget.value)
              }}
              onBlur={commitHsl}
              onKeyDown={e => {
                if (e.key === 'Enter') commitHsl()
              }}
            />
            <span class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              L
            </span>
          </div>
        </div>
      </Show>
    </div>
  )
}
