import { For, type JSX, Show, splitProps } from 'solid-js'
import {
  NavigationItemDescription,
  NavigationItemLabel,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuPortal,
  NavigationMenu as NavigationMenuRoot,
  type NavigationMenuProps as NavigationMenuRootProps,
  NavigationMenuTrigger,
  navigationButtonVariant,
} from '@/components/navigation-menu'
import { cx } from '@/lib/cva'

// ============================================================================
// Types
// ============================================================================

export interface NavMenuItem {
  label: string
  description?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  class?: string
}

export interface NavMenuGroup {
  /** Text displayed on the trigger button. */
  trigger: string
  /**
   * When set without `items` or `content`, the trigger renders as a direct link
   * instead of opening a dropdown.
   */
  href?: string
  /** Items rendered in a grid inside the dropdown panel. */
  items?: NavMenuItem[]
  /** Override the entire dropdown content with custom JSX. Takes precedence over `items`. */
  content?: () => JSX.Element
  /** Extra class applied to the `NavigationMenuContent` wrapper. */
  contentClass?: string
  /**
   * A highlighted/featured item rendered at the start of the content grid
   * (typically spanning the first column on wider layouts).
   */
  featured?: {
    label: string
    description?: string
    href?: string
    class?: string
  }
}

export interface NavMenuProps {
  /** Array of menu groups (each group becomes a trigger + dropdown). */
  menus: NavMenuGroup[]
  /** Orientation of the navigation menu. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Extra class applied to the root `NavigationMenu`. */
  class?: string
  /** Gap between trigger and viewport. @default 6 */
  gutter?: number
}

// ============================================================================
// Internal helpers
// ============================================================================

const defaultContentClass = 'grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2'

const linkItemClass =
  'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'

const featuredClass =
  'flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'

function renderItem(item: NavMenuItem) {
  const inner = (
    <NavigationMenuItem class={item.class} disabled={item.disabled}>
      <NavigationItemLabel>{item.label}</NavigationItemLabel>
      <Show when={item.description}>
        <NavigationItemDescription>{item.description}</NavigationItemDescription>
      </Show>
    </NavigationMenuItem>
  )

  if (item.href) {
    return (
      <a href={item.href} class={linkItemClass} onClick={item.onClick}>
        {inner}
      </a>
    )
  }

  if (item.onClick) {
    return (
      <button type="button" class={linkItemClass} onClick={item.onClick} disabled={item.disabled}>
        {inner}
      </button>
    )
  }

  return inner
}

function renderFeatured(featured: NonNullable<NavMenuGroup['featured']>) {
  const inner = (
    <div class={cx(featuredClass, featured.class)}>
      <div class="mb-2 mt-4 text-lg font-medium">{featured.label}</div>
      <Show when={featured.description}>
        <p class="text-sm leading-tight text-muted-foreground">{featured.description}</p>
      </Show>
    </div>
  )

  if (featured.href) {
    return (
      <a href={featured.href} class="row-span-3">
        {inner}
      </a>
    )
  }

  return <div class="row-span-3">{inner}</div>
}

function renderMenuGroup(group: NavMenuGroup) {
  const isLink = group.href && !group.items?.length && !group.content
  const hasContent = !isLink && (group.content || group.items?.length || group.featured)

  if (isLink) {
    return (
      <NavigationMenuList>
        <a href={group.href} class={navigationButtonVariant()}>
          {group.trigger}
        </a>
      </NavigationMenuList>
    )
  }

  return (
    <NavigationMenuList>
      <NavigationMenuTrigger>{group.trigger}</NavigationMenuTrigger>
      <Show when={hasContent}>
        <NavigationMenuPortal>
          <NavigationMenuContent class={cx(defaultContentClass, group.contentClass)}>
            <Show
              when={group.content}
              fallback={
                <>
                  <Show when={group.featured}>{renderFeatured(group.featured!)}</Show>
                  <Show when={group.items}>
                    <For each={group.items}>{item => renderItem(item)}</For>
                  </Show>
                </>
              }
            >
              {group.content!()}
            </Show>
          </NavigationMenuContent>
        </NavigationMenuPortal>
      </Show>
    </NavigationMenuList>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * Config-driven navigation menu built on top of the `NavigationMenu` primitives.
 *
 * @example
 * ```tsx
 * <NavMenu
 *   menus={[
 *     {
 *       trigger: 'Getting Started',
 *       items: [
 *         { label: 'Introduction', description: 'Re-usable components built with Kobalte.', href: '/docs' },
 *         { label: 'Installation', description: 'How to install and set up.', href: '/docs/install' },
 *       ],
 *     },
 *     {
 *       trigger: 'Components',
 *       featured: { label: 'shadcn-solid', description: 'Beautifully designed components.', href: '/' },
 *       items: [
 *         { label: 'Alert Dialog', description: 'A modal dialog.', href: '/docs/alert-dialog' },
 *         { label: 'Hover Card', description: 'Preview content behind a link.', href: '/docs/hover-card' },
 *       ],
 *     },
 *     { trigger: 'GitHub', href: 'https://github.com' },
 *   ]}
 * />
 * ```
 */
export function NavMenu(props: NavMenuProps) {
  const [local, rest] = splitProps(props, ['menus', 'class', 'orientation', 'gutter'])

  return (
    <NavigationMenuRoot
      orientation={local.orientation}
      gutter={local.gutter}
      class={local.class}
      {...(rest as Omit<NavigationMenuRootProps, 'class' | 'orientation' | 'gutter'>)}
    >
      <For each={local.menus}>{group => renderMenuGroup(group)}</For>
    </NavigationMenuRoot>
  )
}
