import { buttonVariants } from 'shadcn-solid-components/components/button'
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from 'shadcn-solid-components/components/popover'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, createEffect, createSignal, Show, splitProps } from 'solid-js'
import { AlphaSlider, HueSlider } from './Slider'
import { ColorInput } from './ColorInput'
import { ColorPanel } from './ColorPanel'
import { ColorPreview } from './ColorPreview'
import { ColorSwatches } from './ColorSwatches'
import type { ColorFormat, HSVA } from './color-utils'
import {
  getEyeDropperCtor,
  hsvaToRgba,
  normalizeHsva,
  parseColor,
  stringifyColor,
} from './color-utils'

export type { ColorFormat } from './color-utils'
export type ColorPickerMode = 'inline' | 'popover'

const DEFAULT_SWATCHES = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF',
  '#9900FF', '#FF00FF', '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3',
]

export interface ColorPickerProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  format?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  mode?: ColorPickerMode
  showAlpha?: boolean
  swatches?: string[]
  disabled?: boolean
}

export const ColorPicker = (props: ColorPickerProps) => {
  const [local, rest] = splitProps(props, [
    'class',
    'value',
    'defaultValue',
    'onValueChange',
    'format',
    'onFormatChange',
    'mode',
    'showAlpha',
    'swatches',
    'disabled',
  ])

  const initialHsva = parseColor(local.value ?? local.defaultValue ?? '#000000') ?? {
    h: 0,
    s: 1,
    v: 1,
    a: 1,
  }

  const [hsva, setHsva] = createSignal<HSVA>(initialHsva)
  const [format, setFormat] = createSignal<ColorFormat>(local.format ?? 'hex')
  const [previousColor, setPreviousColor] = createSignal<string | undefined>(undefined)

  createEffect(() => {
    const nextFormat = local.format
    if (!nextFormat) return
    setFormat(nextFormat)
  })

  createEffect(() => {
    const controlledValue = local.value
    if (controlledValue == null) return
    const parsed = parseColor(controlledValue)
    if (!parsed) return
    setHsva(parsed)
  })

  const showAlpha = () => local.showAlpha !== false

  const commitColor = (next: HSVA) => {
    setHsva(normalizeHsva(next))
    local.onValueChange?.(stringifyColor(next, format(), showAlpha()))
  }

  const onFormatUpdate = (next: ColorFormat) => {
    setFormat(next)
    local.onFormatChange?.(next)
    local.onValueChange?.(stringifyColor(hsva(), next, showAlpha()))
  }

  const onPickColor = async () => {
    if (local.disabled) return

    const EyeDropperCtor = getEyeDropperCtor()
    if (!EyeDropperCtor) return

    try {
      const eyeDropper = new EyeDropperCtor()
      const result = await eyeDropper.open()
      const parsed = parseColor(result.sRGBHex)
      if (!parsed) return
      commitColor({ ...parsed, a: hsva().a })
    } catch {
      return
    }
  }

  const isEyeDropperAvailable = () => !!getEyeDropperCtor()

  const colorText = () => stringifyColor(hsva(), format(), showAlpha())
  const alphaPercent = () => `${Math.round(hsva().a * 100)}`

  const rgba = () => hsvaToRgba(hsva())
  const previewCss = () => {
    const c = rgba()
    if (showAlpha() && c.a < 1) {
      return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
    }
    return `rgb(${c.r}, ${c.g}, ${c.b})`
  }

  const panel = () => (
    <div
      data-slot="color-picker"
      class={cx('flex h-auto w-72 flex-col gap-3', local.class)}
      {...rest}
    >
      <ColorPanel
        hsva={hsva()}
        disabled={local.disabled}
        onChange={commitColor}
      />

      <HueSlider
        hue={hsva().h}
        disabled={local.disabled}
        onChange={h => commitColor({ ...hsva(), h })}
      />

      <Show when={showAlpha()}>
        <AlphaSlider
          hsva={hsva()}
          disabled={local.disabled}
          onChange={a => commitColor({ ...hsva(), a })}
        />
      </Show>

      <ColorPreview
        hsva={hsva()}
        previousColor={previousColor()}
        showAlpha={showAlpha()}
      />

      <ColorInput
        hsva={hsva()}
        format={format()}
        showAlpha={showAlpha()}
        disabled={local.disabled}
        onChange={commitColor}
        onFormatChange={onFormatUpdate}
      />

      <Show when={local.swatches !== null}>
        <ColorSwatches
          colors={local.swatches ?? DEFAULT_SWATCHES}
          hsva={hsva()}
          disabled={local.disabled}
          onChange={commitColor}
        />
      </Show>

      <div class="flex items-center gap-2">
        <button
          data-slot="color-picker-eyedropper"
          type="button"
          class={cx(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'size-7 shrink-0 text-muted-foreground',
          )}
          disabled={local.disabled || !isEyeDropperAvailable()}
          onClick={onPickColor}
          aria-label="Pick color from screen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3.5">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m12 9l-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m18 9l.4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4l3.4-3.4a1 1 0 1 1 3 3z"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m2 22l.414-.414"
            />
          </svg>
        </button>

        <div class="relative flex w-full min-w-0 items-center -space-x-px rounded-md shadow-sm">
          <input
            data-slot="color-picker-value"
            type="text"
            readOnly
            value={colorText()}
            class="h-7 w-full min-w-0 truncate rounded-l-md border border-input bg-muted px-2 text-xs shadow-none focus:outline-none"
          />
          <Show when={showAlpha()}>
            <div class="relative shrink-0">
              <input
                data-slot="color-picker-alpha-value"
                type="text"
                readOnly
                value={alphaPercent()}
                class="h-7 w-[3.5rem] rounded-r-md border border-l-0 border-input bg-muted px-2 pr-5 text-xs shadow-none focus:outline-none"
              />
              <span class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )

  return (
    <Show when={local.mode === 'popover'} fallback={panel()}>
      <Popover>
        <PopoverTrigger
          class={cx(
            buttonVariants({ variant: 'outline' }),
            'justify-start gap-2 font-normal',
            local.disabled && 'pointer-events-none opacity-50',
          )}
          disabled={local.disabled}
          onClick={() => setPreviousColor(colorText())}
        >
          <span
            class="size-4 rounded-component border border-border"
            style={{ background: previewCss() }}
          />
          <span class="text-xs">{colorText()}</span>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class="w-auto p-4">{panel()}</PopoverContent>
        </PopoverPortal>
      </Popover>
    </Show>
  )
}
