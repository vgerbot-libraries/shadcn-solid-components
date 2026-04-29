import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { Drawer, DrawerContent } from 'shadcn-solid-components/components/drawer'
import { OverlayPage } from 'shadcn-solid-components/hoc/overlay-page'
import type { OverlayPageLocale, SettingsLayoutLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createSignal,
  For,
  type JSX,
  Match,
  Show,
  splitProps,
  Switch,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface SettingsSection {
  /** Unique section identifier. */
  id: string
  /** Display label for the navigation item. */
  label: string
  /** Optional icon rendered before the label. */
  icon?: JSX.Element
}

export interface SettingsLayoutProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Array of section definitions for the sidebar navigation. */
  sections: SettingsSection[]
  /** Currently active section ID (controlled). */
  activeSection?: string
  /** Default active section ID (uncontrolled). */
  defaultActiveSection?: string
  /** Callback fired when the active section changes. */
  onSectionChange?: (sectionId: string) => void
  /** Children elements keyed by section ID, or a render function. */
  children: Record<string, JSX.Element> | ((sectionId: string) => JSX.Element)
  /** Width of the sidebar. Defaults to 256px (w-64). */
  sidebarWidth?: string
  /** When true, sidebar is hidden and content takes full width. */
  hideSidebar?: boolean
  /** Optional page title forwarded to the shared page shell. */
  title?: string
  /** Optional page description forwarded to the shared page shell. */
  description?: string | JSX.Element
  /** Optional header actions rendered beside the mobile menu button. */
  actions?: JSX.Element
  /** Whether to render the shared page shell as a viewport-covering overlay. */
  overlay?: boolean
  /** Show the header back button. Defaults to `true`. */
  showBackButton?: boolean
  /** Custom click handler for the header back button. */
  onBack?: () => void
  /** Optional href to render the back button as a link. */
  backHref?: string
  /** Custom label for the back button. */
  backLabel?: string
  /** Locale overrides for settings-specific strings. */
  locale?: Partial<SettingsLayoutLocale>
  /** Locale overrides for the shared overlay shell. */
  overlayLocale?: Partial<OverlayPageLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A settings page layout with a sidebar navigation and content panel.
 * Responsive: sidebar slides in on mobile as a drawer, and docks alongside
 * the content inside a shared page shell on desktop.
 *
 * @example
 * ```tsx
 * const sections = [
 *   { id: 'profile', label: 'Profile', icon: <User class="h-4 w-4" /> },
 *   { id: 'security', label: 'Security', icon: <Shield class="h-4 w-4" /> }
 * ]
 *
 * <SettingsLayout
 *   sections={sections}
 *   defaultActiveSection="profile"
 * >
 *   {{
 *     profile: <ProfileSettings />,
 *     security: <SecuritySettings />
 *   }}
 * </SettingsLayout>
 * ```
 */
export function SettingsLayout(props: SettingsLayoutProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'sections',
    'activeSection',
    'defaultActiveSection',
    'onSectionChange',
    'children',
    'sidebarWidth',
    'hideSidebar',
    'title',
    'description',
    'actions',
    'overlay',
    'showBackButton',
    'onBack',
    'backHref',
    'backLabel',
    'locale',
    'overlayLocale',
  ])

  const globalLocale = useLocale()
  const locale = (): SettingsLayoutLocale => ({
    ...defaultLocale,
    ...globalLocale.SettingsLayout,
    ...local.locale,
  })

  // Mobile sheet state
  const [mobileOpen, setMobileOpen] = createSignal(false)

  // Internal active section state (uncontrolled mode)
  const [internalActive, setInternalActive] = createSignal(
    local.defaultActiveSection ?? local.sections[0]?.id ?? '',
  )

  // Computed active section (controlled or uncontrolled)
  const activeSection = () => local.activeSection ?? internalActive()

  const handleSectionChange = (sectionId: string) => {
    setInternalActive(sectionId)
    local.onSectionChange?.(sectionId)
    setMobileOpen(false)
  }

  const renderContent = () => {
    const active = activeSection()
    if (typeof local.children === 'function') {
      return local.children(active)
    }
    return local.children[active]
  }

  const sidebarClasses = 'flex flex-col gap-2 p-6'

  const sidebarNav = () => (
    <nav class={sidebarClasses} data-slot="settings-sidebar">
      <For each={local.sections}>
        {section => (
          <button
            type="button"
            onClick={() => handleSectionChange(section.id)}
            class={cx(
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeSection() === section.id
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
            )}
            data-active={activeSection() === section.id}
          >
            <Show when={section.icon}>{section.icon}</Show>
            {section.label}
          </button>
        )}
      </For>
    </nav>
  )

  const hasHeaderActions = () => !local.hideSidebar || !!local.actions

  const headerActions = () => {
    if (!hasHeaderActions()) {
      return undefined
    }

    return (
      <>
        <Show when={!local.hideSidebar}>
          <Button
            variant="outline"
            size="icon-sm"
            class="lg:hidden"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={locale().toggleSidebar}
          >
            <Switch>
              <Match when={mobileOpen()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Match>
              <Match when={!mobileOpen()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Match>
            </Switch>
          </Button>
        </Show>
        <Show when={local.actions}>{local.actions}</Show>
      </>
    )
  }

  const sidebarStyle = () => (local.sidebarWidth ? { width: local.sidebarWidth } : undefined)

  return (
    <OverlayPage
      data-slot="settings-layout"
      class={local.class}
      overlay={local.overlay ?? false}
      title={local.title}
      description={local.description}
      actions={headerActions()}
      showBackButton={local.showBackButton}
      onBack={local.onBack}
      backHref={local.backHref}
      backLabel={local.backLabel}
      locale={local.overlayLocale}
      {...rest}
    >
      <Show when={!local.hideSidebar}>
        <Drawer open={mobileOpen()} onOpenChange={setMobileOpen} side="left">
          <DrawerContent class={cx('p-0', local.sidebarWidth ? '' : 'w-64')} style={sidebarStyle()}>
            {sidebarNav()}
          </DrawerContent>
        </Drawer>
      </Show>

      <div class="mx-auto flex min-h-full w-full max-w-7xl flex-col lg:flex-row">
        <Show when={!local.hideSidebar}>
          <aside
            class={cx(
              'bg-card hidden shrink-0 border-r lg:block',
              local.sidebarWidth ? '' : 'w-64',
            )}
            style={sidebarStyle()}
          >
            <div class="sticky top-0">{sidebarNav()}</div>
          </aside>
        </Show>

        <div class="min-w-0 flex-1 p-6 lg:p-8">
          <div class="mx-auto w-full max-w-4xl" data-slot="settings-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </OverlayPage>
  )
}
