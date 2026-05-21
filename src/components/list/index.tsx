import type { VariantProps } from 'cva'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type Accessor,
  type ComponentProps,
  createContext,
  For,
  mergeProps,
  splitProps,
  useContext,
} from 'solid-js'

export type ListVariant = 'default' | 'outlined' | 'filled' | 'borderless'
export type ListSize = 'sm' | 'default' | 'lg'
export type ListItemLayout = 'horizontal' | 'vertical'

export const listVariants = cva({
  base: 'w-full text-foreground',
  variants: {
    variant: {
      default: 'bg-background',
      outlined: 'rounded-component border bg-background',
      filled: 'rounded-component bg-muted/40',
      borderless: 'bg-transparent',
    },
    size: {
      sm: 'text-sm',
      default: 'text-sm',
      lg: 'text-base',
    },
    split: {
      true: 'divide-y',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    split: true,
  },
})

export const listItemVariants = cva({
  base: 'group/list-item relative flex gap-3 px-4 transition-colors',
  variants: {
    layout: {
      horizontal: 'items-start justify-between',
      vertical: 'flex-col items-stretch',
    },
    size: {
      sm: 'py-2.5',
      default: 'py-3.5',
      lg: 'py-5',
    },
    selected: {
      true: 'bg-accent/50',
      false: '',
    },
    expanded: {
      true: 'bg-muted/60',
      false: '',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    size: 'default',
    selected: false,
    expanded: false,
  },
})

type ListContextValue = {
  size: Accessor<ListSize>
  itemLayout: Accessor<ListItemLayout>
}

const ListContext = createContext<ListContextValue>()

export type ListProps = ComponentProps<'div'> &
  VariantProps<typeof listVariants> & {
    itemLayout?: ListItemLayout
  }

export const List = (props: ListProps) => {
  const merge = mergeProps(
    {
      variant: 'default',
      size: 'default',
      split: true,
      itemLayout: 'horizontal',
    } as ListProps,
    props,
  )

  const [local, rest] = splitProps(merge, [
    'class',
    'children',
    'variant',
    'size',
    'split',
    'itemLayout',
  ])
  const componentClass = useComponentClass(ComponentName.List, merge)

  const size = () => (local.size ?? 'default') as ListSize
  const itemLayout = () => (local.itemLayout ?? 'horizontal') as ListItemLayout

  return (
    <ListContext.Provider value={{ size, itemLayout }}>
      <div
        data-slot="list"
        data-size={size()}
        data-item-layout={itemLayout()}
        class={cx(
          listVariants({
            variant: local.variant,
            size: local.size,
            split: local.split,
          }),
          'rounded-component',
          componentClass,
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </div>
    </ListContext.Provider>
  )
}

export type ListHeaderProps = ComponentProps<'div'>

export const ListHeader = (props: ListHeaderProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-header"
      class={cx('flex items-center justify-between gap-3 px-4 py-3', props.class)}
      {...rest}
    />
  )
}

export type ListToolbarProps = ComponentProps<'div'>

export const ListToolbar = (props: ListToolbarProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-toolbar"
      class={cx('flex flex-wrap items-center gap-2', props.class)}
      {...rest}
    />
  )
}

export type ListBodyProps = ComponentProps<'div'>

export const ListBody = (props: ListBodyProps) => {
  const [, rest] = splitProps(props, ['class'])

  return <div data-slot="list-body" class={cx('flex flex-col', props.class)} {...rest} />
}

export type ListItemProps = ComponentProps<'div'> &
  VariantProps<typeof listItemVariants> & {
    selected?: boolean
    expanded?: boolean
  }

export const ListItem = (props: ListItemProps) => {
  const [local, rest] = splitProps(props, ['class', 'layout', 'size', 'selected', 'expanded'])
  const context = useContext(ListContext)

  const layout = () => (local.layout ?? context?.itemLayout() ?? 'horizontal') as ListItemLayout
  const size = () => (local.size ?? context?.size() ?? 'default') as ListSize
  const selected = () => local.selected ?? false
  const expanded = () => local.expanded ?? false

  return (
    <div
      data-slot="list-item"
      data-layout={layout()}
      data-size={size()}
      data-selected={selected() ? 'true' : undefined}
      data-expanded={expanded() ? 'true' : undefined}
      class={cx(
        listItemVariants({
          layout: layout(),
          size: size(),
          selected: selected(),
          expanded: expanded(),
        }),
        local.class,
      )}
      {...rest}
    />
  )
}

export type ListItemMediaProps = ComponentProps<'div'>

export const ListItemMedia = (props: ListItemMediaProps) => {
  const [, rest] = splitProps(props, ['class'])

  return <div data-slot="list-item-media" class={cx('shrink-0', props.class)} {...rest} />
}

export type ListItemMainProps = ComponentProps<'div'>

export const ListItemMain = (props: ListItemMainProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div data-slot="list-item-main" class={cx('min-w-0 flex-1 space-y-1', props.class)} {...rest} />
  )
}

export type ListItemTypeProps = ComponentProps<'div'>

export const ListItemType = (props: ListItemTypeProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-type"
      class={cx(
        'text-muted-foreground inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs',
        props.class,
      )}
      {...rest}
    />
  )
}

export type ListItemTitleProps = ComponentProps<'div'>

export const ListItemTitle = (props: ListItemTitleProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div data-slot="list-item-title" class={cx('truncate font-medium', props.class)} {...rest} />
  )
}

export type ListItemSubTitleProps = ComponentProps<'div'>

export const ListItemSubTitle = (props: ListItemSubTitleProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-subtitle"
      class={cx('text-muted-foreground text-xs', props.class)}
      {...rest}
    />
  )
}

export type ListItemDescriptionProps = ComponentProps<'div'>

export const ListItemDescription = (props: ListItemDescriptionProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-description"
      class={cx('text-muted-foreground text-sm', props.class)}
      {...rest}
    />
  )
}

export type ListItemMetaProps = ComponentProps<'div'>

export const ListItemMeta = (props: ListItemMetaProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-meta"
      class={cx('text-muted-foreground flex items-center gap-2 text-xs', props.class)}
      {...rest}
    />
  )
}

export type ListItemContentProps = ComponentProps<'div'>

export const ListItemContent = (props: ListItemContentProps) => {
  const [, rest] = splitProps(props, ['class'])

  return <div data-slot="list-item-content" class={cx('text-sm', props.class)} {...rest} />
}

export type ListItemAsideProps = ComponentProps<'div'>

export const ListItemAside = (props: ListItemAsideProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-aside"
      class={cx('text-muted-foreground shrink-0 text-sm', props.class)}
      {...rest}
    />
  )
}

export type ListItemActionsProps = ComponentProps<'div'>

export const ListItemActions = (props: ListItemActionsProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-item-actions"
      class={cx('flex shrink-0 items-center gap-2', props.class)}
      {...rest}
    />
  )
}

export type ListFooterProps = ComponentProps<'div'>

export const ListFooter = (props: ListFooterProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-footer"
      class={cx('text-muted-foreground px-4 py-3 text-sm', props.class)}
      {...rest}
    />
  )
}

export type ListEmptyProps = ComponentProps<'div'>

export const ListEmpty = (props: ListEmptyProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="list-empty"
      class={cx(
        'text-muted-foreground flex min-h-24 items-center justify-center px-4 py-8 text-sm',
        props.class,
      )}
      {...rest}
    />
  )
}

export type ListSkeletonProps = ComponentProps<'div'> & {
  rows?: number
}

export const ListSkeleton = (props: ListSkeletonProps) => {
  const merge = mergeProps({ rows: 3 } as ListSkeletonProps, props)
  const [local, rest] = splitProps(merge, ['class', 'rows'])

  return (
    <div
      data-slot="list-skeleton"
      class={cx('flex flex-col gap-3 px-4 py-3', local.class)}
      {...rest}
    >
      <For each={Array.from({ length: local.rows ?? 3 })}>
        {() => (
          <div data-slot="list-skeleton-row" class="space-y-2">
            <div class="bg-muted h-4 w-2/5 animate-pulse rounded" />
            <div class="bg-muted h-3 w-full animate-pulse rounded" />
          </div>
        )}
      </For>
    </div>
  )
}
