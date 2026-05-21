import { Root as ButtonPrimitive } from '@kobalte/core/button'
import type { VariantProps } from 'cva'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import type { ComponentProps, JSX, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'

export const buttonVariants = cva({
  base: [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all [&_svg:not([class*=size-])]:size-4 shrink-0 outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-[invalid]:ring-destructive/20 aria-[invalid]:dark:ring-destructive/40 aria-[invalid]:border-destructive',
  ],

  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive:
        'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 focus-visible:dark:ring-destructive/40 dark:bg-destructive/60',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:dark:bg-input/50 dark:bg-input/30 dark:border-input',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground hover:dark:bg-accent/50',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2 has-[>svg]:px-3',
      sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
      lg: 'h-10 px-6 has-[>svg]:px-4',
      icon: 'size-9',
      'icon-sm': 'size-8',
      'icon-lg': 'size-10',
    },
    loading: {
      true: '[&>[data-slot=button-loading-indicator]]:inline-flex [&>[data-slot=button-loading-indicator]]:size-4 [&>[data-slot=button-loading-indicator]]:shrink-0 [&>[data-slot=button-loading-indicator]>svg]:animate-spin',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type ButtonLoadingPlacement = 'start' | 'end'

export type ButtonLoadingDisabledBehavior = 'disabled' | 'keep-enabled'

export type ButtonProps<T extends ValidComponent = 'button'> = ComponentProps<
  typeof ButtonPrimitive<T>
> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    loadingText?: JSX.Element
    loadingIcon?: JSX.Element
    loadingPlacement?: ButtonLoadingPlacement
    loadingDisabledBehavior?: ButtonLoadingDisabledBehavior
  }

const createDefaultLoadingIcon = () => (
  <svg
    data-slot="button-loading-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
  >
    <path d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9" />
  </svg>
)

export const Button = <T extends ValidComponent = 'button'>(props: ButtonProps<T>) => {
  const [local, rest] = splitProps(props as ButtonProps, [
    'children',
    'class',
    'variant',
    'size',
    'disabled',
    'loading',
    'loadingText',
    'loadingIcon',
    'loadingPlacement',
    'loadingDisabledBehavior',
  ])

  const loadingPlacement = (): ButtonLoadingPlacement => local.loadingPlacement ?? 'start'
  const loadingDisabledBehavior = (): ButtonLoadingDisabledBehavior =>
    local.loadingDisabledBehavior ?? 'disabled'
  const isDisabled = (): boolean =>
    Boolean(local.disabled || (local.loading && loadingDisabledBehavior() === 'disabled'))
  const content = (): JSX.Element =>
    (local.loading && local.loadingText !== undefined
      ? local.loadingText
      : local.children) as JSX.Element

  const componentClass = useComponentClass(ComponentName.Button, props as ButtonProps)

  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={local.loading ? true : undefined}
      disabled={isDisabled()}
      class={cx(
        buttonVariants({
          variant: local.variant,
          size: local.size,
          loading: local.loading ? true : undefined,
        }),
        'rounded-component',
        componentClass,
        local.class,
      )}
      {...rest}
    >
      {local.loading && loadingPlacement() === 'start' ? (
        <span data-slot="button-loading-indicator" aria-hidden="true">
          {local.loadingIcon ?? createDefaultLoadingIcon()}
        </span>
      ) : null}
      {content()}
      {local.loading && loadingPlacement() === 'end' ? (
        <span data-slot="button-loading-indicator" aria-hidden="true">
          {local.loadingIcon ?? createDefaultLoadingIcon()}
        </span>
      ) : null}
    </ButtonPrimitive>
  )
}
