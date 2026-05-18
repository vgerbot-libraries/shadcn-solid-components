import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, type JSX, mergeProps, splitProps } from 'solid-js'

import './index.css'

export type SpinnerVariant =
  | 'default'
  | 'throbber'
  | 'pinwheel'
  | 'circle-filled'
  | 'ellipsis'
  | 'bars'
  | 'orbital'
  | 'pulse'
  | 'cube-grid'
  | 'fading-circle'
  | 'folding-cube'

export type SpinnerSpeed = 'slow' | 'default' | 'fast'

export const spinnerVariants = cva({
  base: 'inline-flex size-4 shrink-0 items-center justify-center text-current [--spinner-duration:0.9s]',
  variants: {
    speed: {
      slow: '[--spinner-duration:1.4s]',
      default: '[--spinner-duration:0.9s]',
      fast: '[--spinner-duration:0.6s]',
    },
  },
  defaultVariants: {
    speed: 'default',
  },
})

type SpinnerPreset = {
  indicatorClass: string
  renderIcon: () => JSX.Element
}

const SPINNER_PRESETS: Record<SpinnerVariant, SpinnerPreset> = {
  default: {
    indicatorClass: 'shadcn-spinner-rotate',
    renderIcon: () => (
      <svg
        data-slot="spinner-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-full"
      >
        <path d="M12 6l0 -3" />
        <path d="M16.25 7.75l2.15 -2.15" />
        <path d="M18 12l3 0" />
        <path d="M16.25 16.25l2.15 2.15" />
        <path d="M12 18l0 3" />
        <path d="M7.75 16.25l-2.15 2.15" />
        <path d="M6 12l-3 0" />
        <path d="M7.75 7.75l-2.15 -2.15" />
      </svg>
    ),
  },
  throbber: {
    indicatorClass: 'shadcn-spinner-rotate',
    renderIcon: () => (
      <svg
        data-slot="spinner-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="size-full shadcn-spinner-throbber-icon"
      >
        <circle cx="12" cy="12" r="9" class="opacity-25" stroke="currentColor" stroke-width="3" />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    ),
  },
  pinwheel: {
    indicatorClass: 'shadcn-spinner-pinwheel',
    renderIcon: () => (
      <svg
        data-slot="spinner-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-full"
      >
        <path d="M12 2a4 4 0 0 1 4 4v4h-4z" opacity="1" />
        <path d="M22 12a4 4 0 0 1-4 4h-4v-4z" opacity="0.85" />
        <path d="M12 22a4 4 0 0 1-4-4v-4h4z" opacity="0.7" />
        <path d="M2 12a4 4 0 0 1 4-4h4v4z" opacity="0.55" />
      </svg>
    ),
  },
  'circle-filled': {
    indicatorClass: 'shadcn-spinner-rotate',
    renderIcon: () => (
      <svg
        data-slot="spinner-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-full shadcn-spinner-circle-filled-icon"
      >
        <circle cx="12" cy="3.5" r="1.8" class="dot-1" />
        <circle cx="17.66" cy="5.84" r="1.8" class="dot-2" />
        <circle cx="20" cy="11.5" r="1.8" class="dot-3" />
        <circle cx="17.66" cy="17.16" r="1.8" class="dot-4" />
        <circle cx="12" cy="19.5" r="1.8" class="dot-5" />
        <circle cx="6.34" cy="17.16" r="1.8" class="dot-6" />
        <circle cx="4" cy="11.5" r="1.8" class="dot-7" />
        <circle cx="6.34" cy="5.84" r="1.8" class="dot-8" />
      </svg>
    ),
  },
  ellipsis: {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-ellipsis-icon">
        <span />
        <span />
        <span />
      </span>
    ),
  },
  bars: {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-bars-icon">
        <span />
        <span />
        <span />
        <span />
      </span>
    ),
  },
  orbital: {
    indicatorClass: 'shadcn-spinner-orbital',
    renderIcon: () => (
      <svg
        data-slot="spinner-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="size-full shadcn-spinner-orbital-icon"
      >
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.75" opacity="0.3" />
        <circle cx="12" cy="3.5" r="2" fill="currentColor" />
      </svg>
    ),
  },
  pulse: {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-pulse-icon">
        <span />
        <span />
      </span>
    ),
  },
  'cube-grid': {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-cube-grid-icon">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    ),
  },
  'fading-circle': {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-fading-circle-icon">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    ),
  },
  'folding-cube': {
    indicatorClass: '',
    renderIcon: () => (
      <span data-slot="spinner-icon" class="shadcn-spinner-folding-cube-icon">
        <span />
        <span />
        <span />
        <span />
      </span>
    ),
  },
}

export type SpinnerProps = ComponentProps<'span'> & {
  variant?: SpinnerVariant
  speed?: SpinnerSpeed
  icon?: JSX.Element
  animationClass?: string
}

export const Spinner = (props: SpinnerProps) => {
  const merge = mergeProps(
    {
      role: 'status',
      'aria-label': 'Loading',
      variant: 'default',
      speed: 'default',
    } as SpinnerProps,
    props,
  )
  const [, rest] = splitProps(merge, ['class', 'variant', 'speed', 'icon', 'animationClass'])

  const componentClass = useComponentClass(ComponentName.Spinner, merge)
  const variant = (merge.variant ?? 'default') as SpinnerVariant
  const speed = (merge.speed ?? 'default') as SpinnerSpeed
  const preset = SPINNER_PRESETS[variant]

  return (
    <span
      data-slot="spinner"
      data-variant={variant}
      class={cx(
        spinnerVariants({
          speed,
        }),
        componentClass,
        merge.class,
      )}
      {...rest}
    >
      <span
        data-slot="spinner-indicator"
        aria-hidden="true"
        class={cx('shadcn-spinner-indicator', preset.indicatorClass, merge.animationClass)}
      >
        {merge.icon ?? preset.renderIcon()}
      </span>
    </span>
  )
}
