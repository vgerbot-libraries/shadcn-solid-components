import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, createMemo, mergeProps, Show, splitProps } from 'solid-js'

export interface WatermarkFont {
  color?: string
  fontSize?: number
  fontWeight?: number | string
  fontFamily?: string
  fontStyle?: string
  lineHeight?: number
}

export interface WatermarkProps extends ComponentProps<'div'> {
  content?: string | string[]
  image?: string
  width?: number
  height?: number
  rotate?: number
  zIndex?: number
  gap?: [number, number]
  offset?: [number, number]
  font?: WatermarkFont
}

interface WatermarkPattern {
  dataUrl: string
  tileWidth: number
  tileHeight: number
  offsetX: number
  offsetY: number
}

const escapeXml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const Watermark = (props: WatermarkProps) => {
  const merge = mergeProps(
    {
      width: 120,
      height: 64,
      rotate: -22,
      zIndex: 9,
      gap: [100, 100],
      font: {
        color: 'rgba(0, 0, 0, 0.15)',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontStyle: 'normal',
        lineHeight: 22,
      },
    } as WatermarkProps,
    props,
  )

  const [local, rest] = splitProps(merge, [
    'class',
    'children',
    'content',
    'image',
    'width',
    'height',
    'rotate',
    'zIndex',
    'gap',
    'offset',
    'font',
  ])

  const componentClass = useComponentClass(ComponentName.Watermark, merge)

  const pattern = createMemo<WatermarkPattern | null>(() => {
    const lines = (Array.isArray(local.content) ? local.content : [local.content]).filter(
      line => line != null && line.length > 0,
    ) as string[]

    if (!local.image && lines.length === 0) {
      return null
    }

    const markWidth = Math.max(1, Math.floor(local.width ?? 120))
    const markHeight = Math.max(1, Math.floor(local.height ?? 64))
    const [gapWidth, gapHeight] = local.gap ?? [100, 100]
    const gapX = Math.max(0, Math.floor(gapWidth))
    const gapY = Math.max(0, Math.floor(gapHeight))
    const offsetX = local.offset?.[0] ?? Math.floor(gapX / 2)
    const offsetY = local.offset?.[1] ?? Math.floor(gapY / 2)
    const tileWidth = markWidth + gapX
    const tileHeight = markHeight + gapY

    const fontColor = local.font?.color ?? 'rgba(0, 0, 0, 0.15)'
    const fontSize = Math.max(1, Math.floor(local.font?.fontSize ?? 16))
    const lineHeight = Math.max(1, Math.floor(local.font?.lineHeight ?? fontSize * 1.4))
    const fontWeight = local.font?.fontWeight ?? 'normal'
    const fontFamily = local.font?.fontFamily ?? 'sans-serif'
    const fontStyle = local.font?.fontStyle ?? 'normal'

    const markNode = local.image
      ? `<image href="${escapeXml(local.image)}" x="0" y="0" width="${markWidth}" height="${markHeight}" preserveAspectRatio="xMidYMid meet" />`
      : (() => {
          const totalTextHeight = lineHeight * lines.length
          const startY = (markHeight - totalTextHeight) / 2 + lineHeight / 2

          return lines
            .map((line, index) => {
              const y = startY + index * lineHeight
              return `<text x="${markWidth / 2}" y="${y}" fill="${escapeXml(fontColor)}" font-size="${fontSize}" font-family="${escapeXml(fontFamily)}" font-style="${escapeXml(fontStyle)}" font-weight="${escapeXml(String(fontWeight))}" text-anchor="middle" dominant-baseline="middle">${escapeXml(line)}</text>`
            })
            .join('')
        })()

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}"><g transform="translate(${markWidth / 2} ${markHeight / 2}) rotate(${local.rotate}) translate(${-markWidth / 2} ${-markHeight / 2})">${markNode}</g></svg>`

    return {
      dataUrl: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
      tileWidth,
      tileHeight,
      offsetX,
      offsetY,
    }
  })

  return (
    <div
      data-slot="watermark"
      class={cx('relative isolate', componentClass, local.class)}
      {...rest}
    >
      {local.children}
      <Show when={pattern()} keyed>
        {currentPattern => (
          <div
            data-slot="watermark-overlay"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 select-none bg-repeat"
            style={{
              'z-index': local.zIndex,
              'background-image': currentPattern.dataUrl,
              'background-size': `${currentPattern.tileWidth}px ${currentPattern.tileHeight}px`,
              'background-position': `${currentPattern.offsetX}px ${currentPattern.offsetY}px`,
            }}
          />
        )}
      </Show>
    </div>
  )
}
