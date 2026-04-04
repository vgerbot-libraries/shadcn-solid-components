import { type ComponentProps, splitProps } from 'solid-js'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { cx } from 'shadcn-solid-components/lib/cva'

export type KbdProps = ComponentProps<'kbd'>

export const Kbd = (props: KbdProps) => {
  const [, rest] = splitProps(props, ['class'])
  const componentClass = useComponentClass(ComponentName.Kbd, props)

  return (
    <kbd
      data-slot="kbd"
      class={cx(
        'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 px-1 font-sans text-xs font-medium select-none',
        "[&_svg:not([class*='size-'])]:size-3",
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        'rounded-component',
        componentClass,
        props.class,
      )}
      {...rest}
    />
  )
}

export type KbdGroupProps = ComponentProps<'div'>

export const KbdGroup = (props: KbdGroupProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="kbd-group"
      class={cx('inline-flex items-center gap-1', props.class)}
      {...rest}
    />
  )
}
