import { Button } from 'shadcn-solid-components/components/button'
import { Drawer, DrawerContent } from 'shadcn-solid-components/components/drawer'
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
}

// ============================================================================
// Component
// ============================================================================

/**
 * A settings page layout with a sidebar navigation and content panel.
 * Responsive: sidebar slides in on mobile as a sheet, fixed on desktop.
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
  ])

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

  const sidebarClasses = cx(
    'flex flex-col gap-2 p-6',
    local.sidebarWidth ? '' : 'w-64',
  )

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

  return (
    <div
      data-slot="settings-layout"
      class={cx('bg-background min-h-screen', local.class)}
      {...rest}
    >
      {/* Mobile menu button */}
      <Show when={!local.hideSidebar}>
        <div class="fixed top-4 left-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle sidebar"
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
        </div>

        {/* Desktop sidebar */}
        <div
          class="bg-card fixed inset-y-0 left-0 z-40 hidden border-r lg:block"
          style={local.sidebarWidth ? { width: local.sidebarWidth } : undefined}
        >
          {sidebarNav()}
        </div>

        {/* Mobile drawer */}
        <Drawer open={mobileOpen()} onOpenChange={setMobileOpen} side="left">
          <DrawerContent class="w-64 p-0">
            {sidebarNav()}
          </DrawerContent>
        </Drawer>
      </Show>

      {/* Main content */}
      <div
        class={cx('p-6 lg:p-8', !local.hideSidebar && 'lg:ml-64')}
        style={
          !local.hideSidebar && local.sidebarWidth
            ? { 'margin-left': local.sidebarWidth }
            : undefined
        }
      >
        <div class="mx-auto max-w-4xl" data-slot="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
