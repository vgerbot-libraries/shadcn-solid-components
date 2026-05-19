import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
} from 'solid-js'

export type CountupEasing = 'linear' | 'easeOut'

export type CountupFormat = (value: number) => string

export type CountupProps = ComponentProps<'span'> & {
  value: number
  from?: number
  duration?: number
  delay?: number
  decimals?: number
  locale?: string | string[]
  useGrouping?: boolean
  format?: CountupFormat
  startOnView?: boolean
  once?: boolean
  easing?: CountupEasing
  onStart?: () => void
  onEnd?: (finalValue: number) => void
}

const toFiniteNumber = (value: number | undefined, fallback: number) => {
  if (value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback
  }

  return value
}

const toNonNegativeInteger = (value: number | undefined, fallback: number) => {
  const normalized = Math.floor(toFiniteNumber(value, fallback))
  return normalized >= 0 ? normalized : fallback
}

const toNonNegativeNumber = (value: number | undefined, fallback: number) => {
  const normalized = toFiniteNumber(value, fallback)
  return normalized >= 0 ? normalized : fallback
}

const getEasedProgress = (progress: number, easing: CountupEasing) => {
  if (easing === 'linear') {
    return progress
  }

  return 1 - (1 - progress) ** 3
}

export const Countup = (props: CountupProps) => {
  const merge = mergeProps(
    {
      from: 0,
      duration: 1200,
      delay: 0,
      decimals: 0,
      useGrouping: true,
      startOnView: false,
      once: true,
      easing: 'easeOut',
    } as Omit<CountupProps, 'value'>,
    props,
  )

  const [local, rest] = splitProps(merge, [
    'class',
    'value',
    'from',
    'duration',
    'delay',
    'decimals',
    'locale',
    'useGrouping',
    'format',
    'startOnView',
    'once',
    'easing',
    'onStart',
    'onEnd',
  ])

  const componentClass = useComponentClass(ComponentName.Countup, merge as CountupProps)
  const [displayValue, setDisplayValue] = createSignal(toFiniteNumber(local.from, 0))
  const [isInView, setIsInView] = createSignal(!local.startOnView)
  const [rootRef, setRootRef] = createSignal<HTMLSpanElement>()

  let frameId: number | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const stopAnimation = () => {
    if (frameId !== undefined && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frameId)
    }
    frameId = undefined

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = undefined
  }

  const decimals = createMemo(() => toNonNegativeInteger(local.decimals, 0))

  const renderedValue = createMemo(() => {
    const precision = decimals()
    return Number(displayValue().toFixed(precision))
  })

  const formatter = createMemo(() => {
    if (local.format) {
      return local.format
    }

    const precision = decimals()
    const numberFormatter = new Intl.NumberFormat(local.locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: local.useGrouping,
    })

    return (value: number) => numberFormatter.format(value)
  })

  const formattedValue = createMemo(() => formatter()(renderedValue()))

  createEffect(() => {
    const node = rootRef()
    if (!node) {
      return
    }

    if (!local.startOnView) {
      setIsInView(true)
      return
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    setIsInView(false)

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (!entry) {
          return
        }

        if (local.once) {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
          return
        }

        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(node)

    onCleanup(() => {
      observer.disconnect()
    })
  })

  createEffect(() => {
    const startOnView = local.startOnView
    const canStart = !startOnView || isInView()
    if (!canStart) {
      stopAnimation()
      return
    }

    const fromValue = toFiniteNumber(local.from, 0)
    const targetValue = toFiniteNumber(local.value, 0)
    const duration = toNonNegativeNumber(local.duration, 1200)
    const delay = toNonNegativeNumber(local.delay, 0)
    const easing = local.easing ?? 'easeOut'

    stopAnimation()
    setDisplayValue(fromValue)

    const commitFinalValue = () => {
      setDisplayValue(targetValue)
      local.onEnd?.(targetValue)
    }

    const beginAnimation = () => {
      local.onStart?.()

      if (duration <= 0 || typeof requestAnimationFrame !== 'function') {
        commitFinalValue()
        return
      }

      const startTime =
        typeof performance !== 'undefined' && typeof performance.now === 'function'
          ? performance.now()
          : Date.now()

      const step = (now: number) => {
        const elapsed = Math.max(0, now - startTime)
        const progress = Math.min(1, elapsed / duration)
        const easedProgress = getEasedProgress(progress, easing)
        const nextValue = fromValue + (targetValue - fromValue) * easedProgress
        setDisplayValue(nextValue)

        if (progress < 1) {
          frameId = requestAnimationFrame(step)
          return
        }

        frameId = undefined
        commitFinalValue()
      }

      frameId = requestAnimationFrame(step)
    }

    if (delay > 0) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        beginAnimation()
      }, delay)
      return
    }

    beginAnimation()
  })

  onCleanup(() => {
    stopAnimation()
  })

  return (
    <span
      ref={setRootRef}
      data-slot="countup"
      class={cx('inline-flex tabular-nums', componentClass, local.class)}
      {...rest}
    >
      {formattedValue()}
    </span>
  )
}
