import QRCodeLib from 'qrcode'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, createMemo, For, Show, splitProps } from 'solid-js'

export type QrCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QrCodeProps extends Omit<ComponentProps<'svg'>, 'children'> {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
  errorCorrectionLevel?: QrCodeErrorCorrectionLevel
}

function isInFinderPattern(row: number, col: number, size: number): boolean {
  return (row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7)
}

export const QrCode = (props: QrCodeProps) => {
  const [, rest] = splitProps(props, [
    'value',
    'size',
    'fgColor',
    'bgColor',
    'errorCorrectionLevel',
    'class',
  ])
  const componentClass = useComponentClass(ComponentName.QrCode, props)

  const size = () => props.size ?? 268
  const fgColor = () => props.fgColor ?? 'var(--foreground)'
  const bgColor = () => props.bgColor ?? 'var(--background)'
  const errorCorrectionLevel = () => props.errorCorrectionLevel ?? 'M'

  const qrData = createMemo(() => {
    try {
      return QRCodeLib.create(props.value, {
        errorCorrectionLevel: errorCorrectionLevel(),
      })
    } catch {
      return null
    }
  })

  const geometry = createMemo(() => {
    const data = qrData()
    if (!data) {
      return null
    }

    const moduleCount = data.modules.size
    const totalSize = size()
    const moduleSize = totalSize / moduleCount
    const circleRadius = moduleSize / 3

    const finderPositions: Array<[number, number]> = [
      [0, 0],
      [0, moduleCount - 7],
      [moduleCount - 7, 0],
    ]

    const finderSize = 7 * moduleSize
    const innerPadding = moduleSize
    const innerWhiteSize = 5 * moduleSize
    const innerBlackSize = 3 * moduleSize

    const circles: Array<{ cx: number; cy: number }> = []
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (data.modules.get(row, col) && !isInFinderPattern(row, col, moduleCount)) {
          circles.push({
            cx: (col + 0.5) * moduleSize,
            cy: (row + 0.5) * moduleSize,
          })
        }
      }
    }

    return {
      totalSize,
      moduleSize,
      circleRadius,
      finderPositions,
      finderSize,
      innerPadding,
      innerWhiteSize,
      innerBlackSize,
      circles,
    }
  })

  return (
    <Show when={geometry()}>
      {g => (
        <svg
          data-slot="qr-code"
          width={g().totalSize}
          height={g().totalSize}
          viewBox={`0 0 ${g().totalSize} ${g().totalSize}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`QR code for ${props.value}`}
          class={cx('block', componentClass, props.class)}
          {...rest}
        >
          <rect width={g().totalSize} height={g().totalSize} fill={bgColor()} rx="12" ry="12" />
          <For each={g().finderPositions}>
            {([r, c]) => {
              const x = c * g().moduleSize
              const y = r * g().moduleSize
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={g().finderSize}
                    height={g().finderSize}
                    fill={fgColor()}
                    rx="12"
                    ry="12"
                  />
                  <rect
                    x={x + g().innerPadding}
                    y={y + g().innerPadding}
                    width={g().innerWhiteSize}
                    height={g().innerWhiteSize}
                    fill={bgColor()}
                    rx="8"
                    ry="8"
                  />
                  <rect
                    x={x + g().innerPadding * 2}
                    y={y + g().innerPadding * 2}
                    width={g().innerBlackSize}
                    height={g().innerBlackSize}
                    fill={fgColor()}
                    rx="3"
                    ry="3"
                  />
                </g>
              )
            }}
          </For>
          <For each={g().circles}>
            {({ cx: x, cy: y }) => <circle cx={x} cy={y} r={g().circleRadius} fill={fgColor()} />}
          </For>
        </svg>
      )}
    </Show>
  )
}
