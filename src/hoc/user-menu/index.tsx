import { useLocale } from '@/components/config-provider'
import type { UserMenuLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { useColorMode } from '@kobalte/core'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { IconLaptop, IconMoon, IconSun } from '@/components/icons'
import { cx } from '@/lib/cva'












// ============================================================================
// Types
// ============================================================================

export interface UserMenuItemDef {
  /** Display label. */
  label: string
  /** Icon rendered before the label. */
  icon?: JSX.Element
  /** Click handler. */
  onSelect?: () => void
  /** If `true` the item is styled as destructive. */
  variant?: 'default' | 'destructive'
}

export interface UserMenuGroupDef {
  /** Optional group heading. */
  label?: string
  items: UserMenuItemDef[]
}

export interface UserMenuProps {
  /** User display name. */
  name: string
  /** User email or secondary line. */
  email?: string
  /** Avatar URL. When omitted a fallback with initials is rendered. */
  avatarUrl?: string
  /** Custom trigger element. Overrides the default avatar button. */
  trigger?: JSX.Element
  /** Menu item groups rendered between the user header and the footer. */
  groups?: UserMenuGroupDef[]
  /** Show built-in theme switcher row. Defaults to `true`. */
  showThemeSwitch?: boolean
  /** Show built-in sign-out item. Defaults to `true`. */
  showSignOut?: boolean
  /** Called when the sign-out item is clicked. */
  onSignOut?: () => void
  /** Locale overrides. */
  locale?: Partial<UserMenuLocale>
  /** Class applied to the dropdown content. */
  contentClass?: string
}

// ============================================================================
// Helpers
// ============================================================================

function Initials(props: { name: string }) {
  const initials = () =>
    props.name
      .split(/\s+/)
      .slice(0, 2)
      .map(s => s[0]?.toUpperCase() ?? '')
      .join('')

  return (
    <span class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-xs font-medium">
      {initials()}
    </span>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A user avatar dropdown menu with optional theme switcher and sign-out.
 *
 * @example
 * ```tsx
 * <UserMenu
 *   name="John Doe"
 *   email="john@example.com"
 *   groups={[
 *     { label: 'Account', items: [
 *       { label: 'Profile', icon: <IconUser class="size-4" />, onSelect: () => navigate('/profile') },
 *       { label: 'Settings', icon: <IconSettings class="size-4" />, onSelect: () => navigate('/settings') },
 *     ]},
 *   ]}
 *   onSignOut={() => logout()}
 * />
 * ```
 */
export function UserMenu(props: UserMenuProps) {
  const { setColorMode } = useColorMode()
  const globalLocale = useLocale()
  const locale = (): UserMenuLocale => ({ ...defaultLocale, ...globalLocale.UserMenu, ...props.locale })
  const showTheme = () => props.showThemeSwitch !== false
  const showSignOut = () => props.showSignOut !== false

  const defaultTrigger = () => (
    <button
      class="focus-visible:ring-ring flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      aria-label={props.name}
    >
      <Show when={props.avatarUrl} fallback={<Initials name={props.name} />}>
        <img src={props.avatarUrl} alt={props.name} class="size-8 rounded-full object-cover" />
      </Show>
    </button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as="div">{props.trigger ?? defaultTrigger()}</DropdownMenuTrigger>

      <DropdownMenuContent class={cx('w-56', props.contentClass)}>
        {/* User info header */}
        <div class="flex items-center gap-3 px-2 py-2">
          <Show when={props.avatarUrl} fallback={<Initials name={props.name} />}>
            <img src={props.avatarUrl} alt={props.name} class="size-8 rounded-full object-cover" />
          </Show>
          <div class="flex flex-col">
            <span class="text-sm font-medium leading-none">{props.name}</span>
            <Show when={props.email}>
              <span class="text-muted-foreground text-xs">{props.email}</span>
            </Show>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Custom groups */}
        <For each={props.groups}>
          {group => (
            <DropdownMenuGroup>
              <Show when={group.label}>
                <DropdownMenuGroupLabel>{group.label}</DropdownMenuGroupLabel>
              </Show>
              <For each={group.items}>
                {item => (
                  <DropdownMenuItem onSelect={() => item.onSelect?.()} variant={item.variant}>
                    <Show when={item.icon}>{item.icon}</Show>
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuGroup>
          )}
        </For>

        <Show when={props.groups?.length}>
          <DropdownMenuSeparator />
        </Show>

        {/* Theme switcher */}
        <Show when={showTheme()}>
          <DropdownMenuGroup>
            <DropdownMenuGroupLabel>{locale().themeLabel}</DropdownMenuGroupLabel>
            <DropdownMenuItem onSelect={() => setColorMode('light')}>
              <IconSun class="size-4" />
              <span>{locale().lightTheme}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setColorMode('dark')}>
              <IconMoon class="size-4" />
              <span>{locale().darkTheme}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setColorMode('system')}>
              <IconLaptop class="size-4" />
              <span>{locale().systemTheme}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </Show>

        {/* Sign out */}
        <Show when={showSignOut()}>
          <DropdownMenuItem variant="destructive" onSelect={() => props.onSignOut?.()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9"
              />
            </svg>
            <span>{locale().signOut}</span>
          </DropdownMenuItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
