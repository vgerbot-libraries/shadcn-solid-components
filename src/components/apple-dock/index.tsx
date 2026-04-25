import type { VariantProps } from 'cva'
import { combineStyle } from 'shadcn-solid-components/lib/combine-style'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import type { Accessor, ComponentProps, JSX } from 'solid-js'
import { createContext, createMemo, createSignal, splitProps, useContext } from 'solid-js'

const DEFAULT_SIZE = 40
const DEFAULT_MAGNIFICATION = 60
const DEFAULT_DISTANCE = 140

export const appleDockVariants = cva({
  base: [
    'supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10',
    'mx-auto mt-8 flex h-[58px] w-max justify-center gap-2 border p-2 backdrop-blur-md',
  ],
  variants: {
    direction: {
      top: 'items-start',
      middle: 'items-center',
      bottom: 'items-end',
    },
  },
  defaultVariants: {
    direction: 'middle',
  },
})

interface AppleDockContextValue {
  mouseX: Accessor<number>
  iconSize: Accessor<number>
  iconMagnification: Accessor<number>
  disableMagnification: Accessor<boolean>
  iconDistance: Accessor<number>
}

const AppleDockContext = createContext<AppleDockContextValue>()

export type AppleDockProps = ComponentProps<'div'> &
  VariantProps<typeof appleDockVariants> & {
    iconSize?: number
    iconMagnification?: number
    disableMagnification?: boolean
    iconDistance?: number
  }

export const AppleDock = (props: AppleDockProps) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'iconSize',
    'iconMagnification',
    'disableMagnification',
    'iconDistance',
    'direction',
  ])

  const [mouseX, setMouseX] = createSignal(Infinity)

  const componentClass = useComponentClass(ComponentName.AppleDock, props)

  const onMouseMove: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = event => {
    setMouseX(event.pageX)
  }

  const onMouseLeave: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = () => {
    setMouseX(Infinity)
  }

  return (
    <AppleDockContext.Provider
      value={{
        mouseX,
        iconSize: () => local.iconSize ?? DEFAULT_SIZE,
        iconMagnification: () => local.iconMagnification ?? DEFAULT_MAGNIFICATION,
        disableMagnification: () => local.disableMagnification ?? false,
        iconDistance: () => local.iconDistance ?? DEFAULT_DISTANCE,
      }}
    >
      <div
        data-slot="apple-dock"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        class={cx(
          appleDockVariants({ direction: local.direction }),
          'rounded-component',
          componentClass,
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </div>
    </AppleDockContext.Provider>
  )
}

export type AppleDockIconProps = ComponentProps<'div'> & {
  size?: number
  magnification?: number
  disableMagnification?: boolean
  distance?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const AppleDockIcon = (props: AppleDockIconProps) => {
  const [local, rest] = splitProps(props, [
    'class',
    'size',
    'magnification',
    'disableMagnification',
    'distance',
    'children',
    'style',
  ])

  const dock = useContext(AppleDockContext)

  let iconRef: HTMLDivElement | undefined

  const size = createMemo(() => local.size ?? dock?.iconSize() ?? DEFAULT_SIZE)
  const magnification = createMemo(
    () => local.magnification ?? dock?.iconMagnification() ?? DEFAULT_MAGNIFICATION,
  )
  const disableMagnification = createMemo(
    () => local.disableMagnification ?? dock?.disableMagnification() ?? false,
  )
  const distance = createMemo(() => local.distance ?? dock?.iconDistance() ?? DEFAULT_DISTANCE)

  const distanceFromCursor = createMemo(() => {
    const cursorX = dock?.mouseX() ?? Infinity
    if (cursorX === Infinity || !iconRef) return Infinity

    const bounds = iconRef.getBoundingClientRect()
    return cursorX - bounds.left - bounds.width / 2
  })

  const iconSize = createMemo(() => {
    const base = size()
    const target = disableMagnification() ? base : magnification()
    const fromCursor = Math.abs(distanceFromCursor())
    const range = distance()

    if (!Number.isFinite(fromCursor) || range <= 0) return base

    const progress = clamp(1 - fromCursor / range, 0, 1)
    return base + (target - base) * progress
  })

  const padding = createMemo(() => Math.max(6, size() * 0.2))

  return (
    <div
      ref={iconRef}
      data-slot="apple-dock-icon"
      style={combineStyle(local.style, {
        width: `${iconSize()}px`,
        height: `${iconSize()}px`,
        padding: `${padding()}px`,
        transition:
          'width 160ms cubic-bezier(0.22, 1, 0.36, 1), height 160ms cubic-bezier(0.22, 1, 0.36, 1)',
      })}
      class={cx(
        'flex aspect-square cursor-pointer items-center justify-center transition-colors',
        'rounded-component',
        disableMagnification() && 'hover:bg-muted',
        local.class,
      )}
      {...rest}
    >
      <div>{local.children}</div>
    </div>
  )
}
