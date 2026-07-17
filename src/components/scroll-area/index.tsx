import type {
  ScrollAreaCornerProps as ScrollAreaCornerPrimitiveProps,
  ScrollAreaRootProps,
  ScrollAreaScrollbarProps as ScrollAreaScrollbarPrimitiveProps,
  ScrollAreaThumbProps as ScrollAreaThumbPrimitiveProps,
  ScrollAreaViewportProps as ScrollAreaViewportPrimitiveProps,
} from '@ark-ui/solid/scroll-area'
import { ScrollArea as ScrollAreaPrimitive } from '@ark-ui/solid/scroll-area'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { mergeProps, splitProps } from 'solid-js'
import './index.css'

export type ScrollAreaProps = ScrollAreaRootProps & {
  orientation?: ScrollAreaScrollbarProps['orientation']
}

export const ScrollArea = (props: ScrollAreaProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'orientation'])
  const componentClass = useComponentClass(ComponentName.ScrollArea, props)

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      class={cx('relative overflow-hidden', 'rounded-component', componentClass, local.class)}
      {...rest}
    >
      <ScrollAreaViewport>{local.children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation={local.orientation ?? 'vertical'} />
      <ScrollAreaCorner />
    </ScrollAreaPrimitive.Root>
  )
}

export type ScrollAreaViewportProps = ScrollAreaViewportPrimitiveProps

export const ScrollAreaViewport = (props: ScrollAreaViewportProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      class={cx('size-full rounded-[inherit]', local.class)}
      {...rest}
    />
  )
}

export type ScrollAreaScrollbarProps = ScrollAreaScrollbarPrimitiveProps

export const ScrollAreaScrollbar = (props: ScrollAreaScrollbarProps) => {
  const merge = mergeProps(
    {
      orientation: 'vertical',
    } as ScrollAreaScrollbarProps,
    props,
  )
  const [local, rest] = splitProps(merge, ['class', 'children', 'orientation'])

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={local.orientation}
      class={cx(
        'flex touch-none select-none p-px transition-colors',
        local.orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        local.orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <ScrollAreaThumb />}
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export type ScrollAreaThumbProps = ScrollAreaThumbPrimitiveProps

export const ScrollAreaThumb = (props: ScrollAreaThumbProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <ScrollAreaPrimitive.Thumb
      data-slot="scroll-area-thumb"
      class={cx('bg-border relative flex-1 rounded-full', local.class)}
      {...rest}
    />
  )
}

export type ScrollAreaCornerProps = ScrollAreaCornerPrimitiveProps

export const ScrollAreaCorner = (props: ScrollAreaCornerProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <ScrollAreaPrimitive.Corner
      data-slot="scroll-area-corner"
      class={cx('bg-border', local.class)}
      {...rest}
    />
  )
}
