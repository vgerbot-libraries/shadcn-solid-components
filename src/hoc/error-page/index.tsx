import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import type { ErrorPageLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type ErrorPageVariant = '404' | '403' | '500' | '503' | 'generic'

export interface ErrorPageProps extends ComponentProps<'div'> {
  /** Preset error variant. Determines default title, description and status code display.
   * @default 'generic'
   */
  variant?: ErrorPageVariant
  /** Custom title. Overrides the variant default. */
  title?: string
  /** Custom description. Overrides the variant default. */
  description?: string
  /** Custom icon or illustration rendered above the title.
   * When omitted, the variant's HTTP status code is displayed as large text.
   */
  icon?: JSX.Element
  /** Action buttons (e.g. "Go home", "Retry").
   * When omitted, a default "Go back home" button linking to `/` is rendered.
   */
  actions?: JSX.Element
}

// ============================================================================
// Component
// ============================================================================

/**
 * A full-page error state with preset variants for common HTTP errors.
 * Provides sensible defaults for title, description and actions while
 * allowing full customisation.
 *
 * @example
 * ```tsx
 * // Simple 404 page with all defaults
 * <ErrorPage variant="404" />
 *
 * // Custom error page
 * <ErrorPage
 *   variant="500"
 *   title="Oops!"
 *   description="We're working on fixing this."
 *   actions={
 *     <>
 *       <Button as="a" href="/">Home</Button>
 *       <Button variant="outline" onClick={() => location.reload()}>Retry</Button>
 *     </>
 *   }
 * />
 * ```
 */
export function ErrorPage(props: ErrorPageProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'title',
    'description',
    'icon',
    'actions',
  ])

  const locale = (): ErrorPageLocale => ({
    ...defaultLocale,
    ...useLocale().ErrorPage,
  })

  const variant = () => local.variant ?? 'generic'
  const title = () => local.title ?? locale().titles[variant()]
  const description = () => local.description ?? locale().descriptions[variant()]

  /** Status code text shown when no custom icon is provided. */
  const statusCode = () => {
    const v = variant()
    return v === 'generic' ? '!' : v
  }

  return (
    <div
      data-slot="error-page"
      class={cx(
        'flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center',
        local.class,
      )}
      {...rest}
    >
      {/* Icon / status code */}
      <Show
        when={local.icon}
        fallback={
          <div
            data-slot="error-page-code"
            class="text-muted-foreground text-7xl font-bold tracking-tighter select-none sm:text-8xl md:text-9xl"
          >
            {statusCode()}
          </div>
        }
      >
        <div data-slot="error-page-icon" class="text-muted-foreground">
          {local.icon}
        </div>
      </Show>

      {/* Title + description */}
      <div class="flex max-w-md flex-col gap-2">
        <h1 data-slot="error-page-title" class="text-2xl font-bold tracking-tight sm:text-3xl">
          {title()}
        </h1>
        <p
          data-slot="error-page-description"
          class="text-muted-foreground text-sm sm:text-base"
        >
          {description()}
        </p>
      </div>

      {/* Actions */}
      <div data-slot="error-page-actions" class="flex flex-wrap items-center justify-center gap-3">
        <Show
          when={local.actions}
          fallback={
            <Button as="a" href="/">
              {locale().goHome}
            </Button>
          }
        >
          {local.actions}
        </Show>
      </div>
    </div>
  )
}
