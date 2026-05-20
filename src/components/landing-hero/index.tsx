import { Drawer, DrawerClose, DrawerContent, DrawerPortal } from 'shadcn-solid-components/components/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'shadcn-solid-components/components/dropdown-menu'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'

export interface LandingHeroBrandConfig {
  logo?: JSX.Element
  title: string
  href?: string
}

export interface LandingHeroNavChildItem {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export interface LandingHeroNavItem {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  children?: LandingHeroNavChildItem[]
}

export type LandingHeroMobileBreakpoint = 'lg' | 'xl'

export interface LandingHeroProps extends Omit<ComponentProps<'header'>, 'children'> {
  brand: LandingHeroBrandConfig
  brandLeading?: JSX.Element
  navItems?: LandingHeroNavItem[]
  primaryActions?: JSX.Element
  secondaryActions?: JSX.Element
  showMobileMenuButton?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
  mobileBreakpoint?: LandingHeroMobileBreakpoint
  menuButtonLabel?: string
  menuPanelLabel?: string
  class?: string
  containerClass?: string
  brandClass?: string
  navClass?: string
  actionsClass?: string
  mobileMenuClass?: string
}

const DEFAULT_MENU_BUTTON_LABEL = 'Open navigation menu'
const DEFAULT_MENU_PANEL_LABEL = 'Navigation menu'

const breakpointClasses = {
  lg: {
    mobileOnly: 'lg:hidden',
    desktopFlex: 'hidden lg:flex',
    desktopBlock: 'hidden lg:block',
  },
  xl: {
    mobileOnly: 'xl:hidden',
    desktopFlex: 'hidden xl:flex',
    desktopBlock: 'hidden xl:block',
  },
} as const

function renderBrand(brand: LandingHeroBrandConfig, className?: string) {
  const content = (
    <>
      <Show when={brand.logo}>{brand.logo}</Show>
      <span class="truncate text-base font-semibold tracking-tight">{brand.title}</span>
    </>
  )

  if (brand.href) {
    return (
      <a href={brand.href} class={cx('flex items-center gap-2', className)}>
        {content}
      </a>
    )
  }

  return <div class={cx('flex items-center gap-2', className)}>{content}</div>
}

function renderDesktopNavItem(item: LandingHeroNavItem, onSelect: () => void) {
  const hasChildren = () => !!item.children?.length

  if (hasChildren()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          as="button"
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2"
          disabled={item.disabled}
        >
          {item.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-3"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m6 9l6 6l6-6"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="min-w-52">
          <For each={item.children}>
            {child =>
              child.href ? (
                <a
                  href={child.href}
                  class={cx('block', child.disabled && 'pointer-events-none opacity-50')}
                  onClick={() => {
                    child.onClick?.()
                    onSelect()
                  }}
                >
                  <DropdownMenuItem>{child.label}</DropdownMenuItem>
                </a>
              ) : (
                <DropdownMenuItem
                  as="button"
                  type="button"
                  disabled={child.disabled}
                  onClick={() => {
                    child.onClick?.()
                    onSelect()
                  }}
                >
                  {child.label}
                </DropdownMenuItem>
              )
            }
          </For>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
        aria-disabled={item.disabled}
        onClick={() => {
          item.onClick?.()
          onSelect()
        }}
      >
        {item.label}
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      class="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2"
      onClick={() => {
        item.onClick?.()
        onSelect()
      }}
    >
      {item.label}
    </button>
  )
}

function renderMobileNavItem(item: LandingHeroNavItem, onSelect: () => void) {
  const hasChildren = () => !!item.children?.length

  if (hasChildren()) {
    return (
      <div class="space-y-2 rounded-md border p-3">
        <p class="text-sm font-medium">{item.label}</p>
        <div class="space-y-1.5">
          <For each={item.children}>
            {child =>
              child.href ? (
                <a
                  href={child.href}
                  class="text-muted-foreground hover:text-foreground hover:bg-accent block rounded-md px-2 py-1.5 text-sm transition-colors"
                  aria-disabled={child.disabled}
                  onClick={() => {
                    child.onClick?.()
                    onSelect()
                  }}
                >
                  {child.label}
                </a>
              ) : (
                <button
                  type="button"
                  disabled={child.disabled}
                  class="text-muted-foreground hover:text-foreground hover:bg-accent block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                  onClick={() => {
                    child.onClick?.()
                    onSelect()
                  }}
                >
                  {child.label}
                </button>
              )
            }
          </For>
        </div>
      </div>
    )
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        class="text-muted-foreground hover:text-foreground hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium transition-colors"
        aria-disabled={item.disabled}
        onClick={() => {
          item.onClick?.()
          onSelect()
        }}
      >
        {item.label}
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      class="text-muted-foreground hover:text-foreground hover:bg-accent block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
      onClick={() => {
        item.onClick?.()
        onSelect()
      }}
    >
      {item.label}
    </button>
  )
}

export function LandingHero(props: LandingHeroProps) {
  const [local, rest] = splitProps(props, [
    'brand',
    'brandLeading',
    'navItems',
    'primaryActions',
    'secondaryActions',
    'showMobileMenuButton',
    'open',
    'defaultOpen',
    'onOpenChange',
    'closeOnSelect',
    'mobileBreakpoint',
    'menuButtonLabel',
    'menuPanelLabel',
    'class',
    'containerClass',
    'brandClass',
    'navClass',
    'actionsClass',
    'mobileMenuClass',
  ])

  const isControlled = () => local.open !== undefined
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false)
  const open = () => (isControlled() ? !!local.open : internalOpen())
  const setOpen = (next: boolean) => {
    if (!isControlled()) {
      setInternalOpen(next)
    }
    local.onOpenChange?.(next)
  }

  const onSelect = () => {
    if (local.closeOnSelect !== false) {
      setOpen(false)
    }
  }

  const activeBreakpoint = () => local.mobileBreakpoint ?? 'lg'
  const visibilityClasses = () => breakpointClasses[activeBreakpoint()]
  const primaryActions = () => local.primaryActions
  const secondaryActions = () => local.secondaryActions
  const shouldShowMobileMenu = () =>
    local.showMobileMenuButton !== false && (!!local.navItems?.length || !!secondaryActions())

  return (
    <header class={cx('border-border/80 bg-background border-b', local.class)} {...rest}>
      <div
        class={cx(
          'mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3',
          local.containerClass,
        )}
      >
        <div class="flex min-w-0 shrink-0 items-center gap-2">
          <Show when={local.brandLeading}>
            <div class="flex items-center">{local.brandLeading}</div>
          </Show>
          <div class="min-w-0">{renderBrand(local.brand, local.brandClass)}</div>
        </div>

        <Show when={local.navItems?.length}>
          <nav class={cx('flex-1 justify-center', visibilityClasses().desktopFlex, local.navClass)}>
            <ul class="flex items-center gap-1">
              <For each={local.navItems}>
                {item => <li>{renderDesktopNavItem(item, onSelect)}</li>}
              </For>
            </ul>
          </nav>
        </Show>

        <div class={cx('flex items-center gap-2', local.actionsClass)}>
          <Show when={primaryActions()}>
            <div class="flex items-center gap-2">{primaryActions()}</div>
          </Show>
          <Show when={secondaryActions()}>
            <div class={cx('items-center gap-2', visibilityClasses().desktopFlex)}>
              {secondaryActions()}
            </div>
          </Show>

          <Show when={shouldShowMobileMenu()}>
            <button
              type="button"
              class={cx(
                'text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2',
                visibilityClasses().mobileOnly,
              )}
              onClick={() => setOpen(true)}
              aria-label={local.menuButtonLabel ?? DEFAULT_MENU_BUTTON_LABEL}
              aria-expanded={open()}
              aria-controls="landing-hero-mobile-menu"
            >
              <Show
                when={open()}
                fallback={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="size-5"
                    aria-hidden="true"
                  >
                    <line
                      x1="4"
                      y1="6"
                      x2="20"
                      y2="6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <line
                      x1="4"
                      y1="12"
                      x2="20"
                      y2="12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <line
                      x1="4"
                      y1="18"
                      x2="20"
                      y2="18"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="size-5"
                  aria-hidden="true"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 6L6 18M6 6l12 12"
                  />
                </svg>
              </Show>
            </button>
          </Show>
        </div>
      </div>

      <Show when={shouldShowMobileMenu()}>
        <Drawer open={open()} onOpenChange={setOpen} side="right" preventScroll={false}>
          <DrawerPortal>
            <DrawerContent
              class={cx('w-[85vw] max-w-[320px] p-0', local.mobileMenuClass)}
              id="landing-hero-mobile-menu"
              aria-label={local.menuPanelLabel ?? DEFAULT_MENU_PANEL_LABEL}
            >
              <div class="flex items-center justify-between border-b px-4 py-3">
                <span class="text-sm font-medium">
                  {local.menuPanelLabel ?? DEFAULT_MENU_PANEL_LABEL}
                </span>
                <DrawerClose
                  class="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="size-4"
                    aria-hidden="true"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M18 6L6 18M6 6l12 12"
                    />
                  </svg>
                </DrawerClose>
              </div>

              <div class="space-y-5 p-4">
                <Show when={local.navItems?.length}>
                  <nav class="space-y-2">
                    <For each={local.navItems}>{item => renderMobileNavItem(item, onSelect)}</For>
                  </nav>
                </Show>

                <Show when={secondaryActions()}>
                  <div class="border-t pt-4">
                    <div class="flex flex-wrap items-center gap-2">{secondaryActions()}</div>
                  </div>
                </Show>
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </Show>
    </header>
  )
}
