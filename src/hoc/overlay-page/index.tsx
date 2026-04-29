import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { IconChevronLeft } from 'shadcn-solid-components/components/icons'
import type { OverlayPageLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface OverlayPageProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Whether to render as a viewport-covering overlay. Defaults to `true`. */
  overlay?: boolean
  /** Optional page title shown in the header. */
  title?: string
  /** Optional descriptive text or element shown below the title. */
  description?: string | JSX.Element
  /** Optional actions rendered on the right side of the header. */
  actions?: JSX.Element
  /** The page body content. */
  children: JSX.Element
  /** Additional class name for the scrollable body region. */
  contentClass?: string
  /** Show the back button. Defaults to `true`. */
  showBackButton?: boolean
  /** Custom click handler for the back button. Defaults to `window.history.back()`. */
  onBack?: () => void
  /** Optional href to render the back button as a link instead of a button. */
  backHref?: string
  /** Custom label for the back button. */
  backLabel?: string
  /** Locale overrides. */
  locale?: Partial<OverlayPageLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A reusable full-page shell for overlay-style flows.
 * Includes a consistent header, optional title/description, and a built-in
 * back button with sensible defaults.
 *
 * @example
 * ```tsx
 * <OverlayPage
 *   title="Settings"
 *   description="Manage your account preferences"
 * >
 *   <SettingsContent />
 * </OverlayPage>
 * ```
 */
export function OverlayPage(props: OverlayPageProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'overlay',
    'title',
    'description',
    'actions',
    'children',
    'contentClass',
    'showBackButton',
    'onBack',
    'backHref',
    'backLabel',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): OverlayPageLocale => ({
    ...defaultLocale,
    ...globalLocale.OverlayPage,
    ...local.locale,
  })

  const backLabel = () => local.backLabel ?? locale().back

  const handleBack = () => {
    if (local.onBack) {
      local.onBack()
      return
    }

    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  const hasHeader = () =>
    local.showBackButton !== false || !!local.title || !!local.description || !!local.actions

  return (
    <div
      data-slot="overlay-page"
      class={cx(
        'bg-background flex min-h-screen flex-col overflow-hidden',
        local.overlay === false ? 'relative' : 'fixed inset-0 z-50',
        local.class,
      )}
      {...rest}
    >
      <Show when={hasHeader()}>
        <div
          data-slot="overlay-page-header"
          class="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 border-b backdrop-blur"
        >
          <div class="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex min-w-0 flex-1 items-start gap-3">
              <Show when={local.showBackButton !== false}>
                <Show
                  when={local.backHref}
                  fallback={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      aria-label={backLabel()}
                    >
                      <IconChevronLeft class="size-4" />
                      <span>{backLabel()}</span>
                    </Button>
                  }
                >
                  <Button
                    as="a"
                    href={local.backHref!}
                    variant="ghost"
                    size="sm"
                    aria-label={backLabel()}
                  >
                    <IconChevronLeft class="size-4" />
                    <span>{backLabel()}</span>
                  </Button>
                </Show>
              </Show>

              <Show when={local.title || local.description}>
                <div class="min-w-0 flex-1">
                  <Show when={local.title}>
                    <h1
                      data-slot="overlay-page-title"
                      class="truncate text-lg font-semibold sm:text-xl"
                    >
                      {local.title}
                    </h1>
                  </Show>
                  <Show when={local.description}>
                    <div
                      data-slot="overlay-page-description"
                      class="text-muted-foreground mt-1 text-sm"
                    >
                      <Show
                        when={typeof local.description === 'string'}
                        fallback={local.description}
                      >
                        <p>{local.description}</p>
                      </Show>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>

            <Show when={local.actions}>
              <div
                data-slot="overlay-page-actions"
                class="flex shrink-0 flex-wrap items-center justify-end gap-2"
              >
                {local.actions}
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <div
        data-slot="overlay-page-content"
        class={cx('min-h-0 flex-1 overflow-y-auto', local.contentClass)}
      >
        {local.children}
      </div>
    </div>
  )
}
