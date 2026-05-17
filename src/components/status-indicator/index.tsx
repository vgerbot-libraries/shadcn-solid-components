import type { VariantProps } from 'cva'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, splitProps } from 'solid-js'

export const statusIndicatorVariants = cva({
  base: 'relative inline-flex shrink-0 rounded-full border border-background',
  variants: {
    status: {
      online: 'bg-emerald-500 text-emerald-500',
      offline: 'bg-muted-foreground/60 text-muted-foreground/60',
      away: 'bg-amber-500 text-amber-500',
      busy: 'bg-red-500 text-red-500',
      'in-progress': 'bg-sky-500 text-sky-500',
    },
    size: {
      xs: 'size-2',
      sm: 'size-2.5',
      md: 'size-3',
      lg: 'size-4',
    },
    pulse: {
      true: 'after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-current after:opacity-75',
      false: '',
    },
  },
  defaultVariants: {
    status: 'online',
    size: 'sm',
    pulse: false,
  },
})

export type StatusIndicatorProps = ComponentProps<'span'> &
  VariantProps<typeof statusIndicatorVariants>

export const StatusIndicator = (props: StatusIndicatorProps) => {
  const [local, rest] = splitProps(props, ['class', 'status', 'size', 'pulse'])

  const componentClass = useComponentClass(ComponentName.StatusIndicator, props)

  return (
    <span
      data-slot="status-indicator"
      class={cx(
        statusIndicatorVariants({
          status: local.status,
          size: local.size,
          pulse: local.pulse,
        }),
        componentClass,
        local.class,
      )}
      {...rest}
    />
  )
}

export const StatusDot = StatusIndicator
