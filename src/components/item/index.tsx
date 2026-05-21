import type { VariantProps } from 'cva'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import type { ComponentProps, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export const itemVariants = cva({
  base: [
    'group/item flex w-full items-start gap-3 text-left transition-colors outline-none',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  ],
  variants: {
    variant: {
      default: 'bg-background hover:bg-accent/50 hover:text-accent-foreground',
      outline: 'border bg-background shadow-xs hover:bg-accent/50 hover:text-accent-foreground',
      muted: 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
      destructive:
        'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
    },
    size: {
      sm: 'min-h-10 gap-2 px-3 py-2 text-sm',
      default: 'min-h-14 px-4 py-3 text-sm',
      lg: 'min-h-16 gap-4 px-5 py-4 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type ItemVariant = NonNullable<VariantProps<typeof itemVariants>['variant']>
export type ItemSize = NonNullable<VariantProps<typeof itemVariants>['size']>

export type ItemProps<T extends ValidComponent = 'div'> = ComponentProps<T> &
  VariantProps<typeof itemVariants> & {
    as?: T
  }

export const Item = <T extends ValidComponent = 'div'>(props: ItemProps<T>) => {
  const [local, rest] = splitProps(props as ItemProps, ['as', 'class', 'variant', 'size'])
  const componentClass = useComponentClass(ComponentName.Item, props as ItemProps)

  return (
    <Dynamic
      component={local.as ?? 'div'}
      data-slot="item"
      data-variant={local.variant ?? 'default'}
      data-size={local.size ?? 'default'}
      class={cx(
        itemVariants({
          variant: local.variant,
          size: local.size,
        }),
        'rounded-component',
        componentClass,
        local.class,
      )}
      {...rest}
    />
  )
}

export type ItemGroupProps = ComponentProps<'div'>

export const ItemGroup = (props: ItemGroupProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div data-slot="item-group" class={cx('flex w-full flex-col gap-2', local.class)} {...rest} />
  )
}

export type ItemHeaderProps = ComponentProps<'div'>

export const ItemHeader = (props: ItemHeaderProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="item-header"
      class={cx(
        'text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase',
        local.class,
      )}
      {...rest}
    />
  )
}

export type ItemMediaProps = ComponentProps<'div'>

export const ItemMedia = (props: ItemMediaProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="item-media"
      class={cx('text-muted-foreground flex shrink-0 items-center justify-center', local.class)}
      {...rest}
    />
  )
}

export type ItemContentProps = ComponentProps<'div'>

export const ItemContent = (props: ItemContentProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="item-content"
      class={cx('flex min-w-0 flex-1 flex-col gap-1 self-center', local.class)}
      {...rest}
    />
  )
}

export type ItemTitleProps = ComponentProps<'div'>

export const ItemTitle = (props: ItemTitleProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="item-title"
      class={cx('truncate font-medium leading-none', local.class)}
      {...rest}
    />
  )
}

export type ItemDescriptionProps = ComponentProps<'p'>

export const ItemDescription = (props: ItemDescriptionProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <p
      data-slot="item-description"
      class={cx('text-muted-foreground line-clamp-2 text-sm leading-snug', local.class)}
      {...rest}
    />
  )
}

export type ItemActionsProps = ComponentProps<'div'>

export const ItemActions = (props: ItemActionsProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="item-actions"
      class={cx('ml-auto flex shrink-0 items-center gap-2 self-center', local.class)}
      {...rest}
    />
  )
}
