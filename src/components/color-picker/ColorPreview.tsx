import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, splitProps } from 'solid-js'
import type { HSVA } from './color-utils'
import { hsvaToRgba, formatRgb } from './color-utils'

const CHECKERBOARD_PATTERN =
  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center'

export interface ColorPreviewProps extends ComponentProps<'div'> {
  hsva: HSVA
  previousColor?: string
  showAlpha: boolean
}

export const ColorPreview = (props: ColorPreviewProps) => {
  const [local, rest] = splitProps(props, ['class', 'hsva', 'previousColor', 'showAlpha'])

  const rgba = () => hsvaToRgba(local.hsva)
  const currentCss = () => {
    const c = rgba()
    if (local.showAlpha && c.a < 1) {
      return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
    }
    return formatRgb(c, false)
  }

  const previousCss = () => local.previousColor ?? ''

  return (
    <div
      data-slot="color-picker-preview"
      class={cx('flex h-4 overflow-hidden rounded-component', local.class)}
      {...rest}
    >
      {local.previousColor && (
        <div
          class="relative flex-1 border-r border-border"
          style={{ 'background-color': previousCss() }}
        >
          <div
            class="absolute inset-0"
            style={{
              background: CHECKERBOARD_PATTERN,
              'background-size': '8px 8px',
              'z-index': -1,
            }}
          />
        </div>
      )}
      <div class="relative flex-1" style={{ 'background-color': currentCss() }}>
        <div
          class="absolute inset-0"
          style={{
            background: CHECKERBOARD_PATTERN,
            'background-size': '8px 8px',
            'z-index': -1,
          }}
        />
      </div>
    </div>
  )
}
