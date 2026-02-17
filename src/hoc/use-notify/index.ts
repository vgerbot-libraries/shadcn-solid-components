import { toast, type ExternalToast } from 'somoto'
import type { JSX } from 'solid-js'

// ============================================================================
// Types
// ============================================================================

/** Notification severity / visual type. */
export type NotifyType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'

/** Options accepted by `useNotify` (defaults) and per-call overrides. */
export interface NotifyOptions extends ExternalToast {
  /** Toast type. Defaults to `'default'`. */
  type?: NotifyType
}

/** Object-form argument for `showNotify({ message, ... })`. */
export interface ShowNotifyOptions extends NotifyOptions {
  /** The message to display. */
  message: JSX.Element
}

/** The callable returned by `useNotify`. */
export interface ShowNotifyFn {
  /** Show a notification with an options object. */
  (options: ShowNotifyOptions): string | number
  /** Show a notification with a message and optional overrides. */
  (message: JSX.Element, options?: NotifyOptions): string | number

  /** Show a success notification. */
  success: (message: JSX.Element, options?: ExternalToast) => string | number
  /** Show an error notification. */
  error: (message: JSX.Element, options?: ExternalToast) => string | number
  /** Show a warning notification. */
  warning: (message: JSX.Element, options?: ExternalToast) => string | number
  /** Show an info notification. */
  info: (message: JSX.Element, options?: ExternalToast) => string | number
  /** Show a loading notification. */
  loading: (message: JSX.Element, options?: ExternalToast) => string | number

  /** Show a custom JSX notification. */
  custom: typeof toast.custom

  /** Promise-based notification that updates automatically. */
  promise: typeof toast.promise

  /** Update an existing toast by id. */
  update: (id: string | number, options: ShowNotifyOptions) => string | number

  /** Dismiss a specific toast by id, or all toasts if no id is given. */
  dismiss: (id?: string | number) => string | number | undefined
}

// ============================================================================
// Helpers
// ============================================================================

function isShowNotifyOptions(value: unknown): value is ShowNotifyOptions {
  return typeof value === 'object' && value !== null && 'message' in value
}

function callToast(
  type: NotifyType,
  message: JSX.Element,
  options: ExternalToast,
): string | number {
  switch (type) {
    case 'success':
      return toast.success(message, options)
    case 'error':
      return toast.error(message, options)
    case 'warning':
      return toast.warning(message, options)
    case 'info':
      return toast.info(message, options)
    case 'loading':
      return toast.loading(message, options)
    default:
      return toast(message, options)
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Create a notification helper with merged default options.
 *
 * @example
 * ```tsx
 * const notify = useNotify({ duration: 5000, position: 'bottom-right' })
 *
 * notify('File saved')
 * notify.success('Upload complete')
 * notify.error('Network error', { duration: 8000 })
 * notify({ message: 'Custom', type: 'warning', description: 'Details here' })
 * ```
 */
export function useNotify(defaults: NotifyOptions = {}): ShowNotifyFn {
  const { type: defaultType = 'default', ...defaultRest } = defaults

  const merge = (overrides: ExternalToast = {}): ExternalToast => ({
    ...defaultRest,
    ...overrides,
  })

  const showNotify = (
    messageOrOptions: JSX.Element | ShowNotifyOptions,
    maybeOptions?: NotifyOptions,
  ): string | number => {
    if (isShowNotifyOptions(messageOrOptions)) {
      const { message, type, ...rest } = messageOrOptions
      return callToast(type ?? defaultType, message, merge(rest))
    }
    const { type, ...rest } = maybeOptions ?? {}
    return callToast(type ?? defaultType, messageOrOptions, merge(rest))
  }

  showNotify.success = (message: JSX.Element, options?: ExternalToast) =>
    callToast('success', message, merge(options))

  showNotify.error = (message: JSX.Element, options?: ExternalToast) =>
    callToast('error', message, merge(options))

  showNotify.warning = (message: JSX.Element, options?: ExternalToast) =>
    callToast('warning', message, merge(options))

  showNotify.info = (message: JSX.Element, options?: ExternalToast) =>
    callToast('info', message, merge(options))

  showNotify.loading = (message: JSX.Element, options?: ExternalToast) =>
    callToast('loading', message, merge(options))

  showNotify.custom = toast.custom

  showNotify.promise = toast.promise

  showNotify.update = (id: string | number, options: ShowNotifyOptions) => {
    const { message, type, ...rest } = options
    return callToast(type ?? defaultType, message, { ...merge(rest), id })
  }

  showNotify.dismiss = (id?: string | number) => toast.dismiss(id)

  return showNotify as ShowNotifyFn
}
