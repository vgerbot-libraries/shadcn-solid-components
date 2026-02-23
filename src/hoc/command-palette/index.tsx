import { useLocale } from '@/components/config-provider'
import type { CommandPaletteLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { createEffect, createSignal, For, type JSX, onCleanup, Show, splitProps } from 'solid-js'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/command'
import { Kbd } from '@/components/kbd'












// ============================================================================
// Types
// ============================================================================

export interface CommandPaletteItem {
  /** Unique identifier used for command matching. */
  id: string
  /** Display label. */
  label: string
  /** Icon rendered before the label. */
  icon?: JSX.Element
  /** Keyboard shortcut hint displayed on the right. */
  shortcut?: string
  /** Called when the item is selected. */
  onSelect?: () => void
  /** If `true` the item is disabled. */
  disabled?: boolean
}

export interface CommandPaletteGroup {
  /** Group heading. */
  label: string
  /** Items in this group. */
  items: CommandPaletteItem[]
}

export interface CommandPaletteProps {
  /** Groups of commands. */
  groups: CommandPaletteGroup[]
  /** Controlled open state. */
  open?: boolean
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Register a global keyboard shortcut to toggle the palette.
   *  Defaults to `'k'` (Cmd+K / Ctrl+K). Set to `false` to disable. */
  hotkey?: string | false
  /** Locale overrides. */
  locale?: Partial<CommandPaletteLocale>
  /** Called when the search value changes. */
  onSearch?: (value: string) => void
  /** Accessible title for the dialog (sr-only). */
  title?: string
  /** Accessible description for the dialog (sr-only). */
  description?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * A global command palette (Cmd+K) built on top of the `Command` component.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   groups={[
 *     { label: 'Pages', items: [
 *       { id: 'home', label: 'Home', icon: <IconHome class="size-4" />, onSelect: () => navigate('/') },
 *       { id: 'settings', label: 'Settings', shortcut: '⌘S', onSelect: () => navigate('/settings') },
 *     ]},
 *   ]}
 * />
 * ```
 */
export function CommandPalette(props: CommandPaletteProps) {
  const globalLocale = useLocale()
  const locale = (): CommandPaletteLocale => ({ ...defaultLocale, ...globalLocale.CommandPalette, ...props.locale })

  const isControlled = () => props.open !== undefined
  const [internalOpen, setInternalOpen] = createSignal(false)

  const open = () => (isControlled() ? props.open! : internalOpen())
  const setOpen = (v: boolean) => {
    if (!isControlled()) setInternalOpen(v)
    props.onOpenChange?.(v)
  }

  // Global keyboard shortcut
  const hotkey = () => (props.hotkey === false ? null : (props.hotkey ?? 'k'))

  createEffect(() => {
    const key = hotkey()
    if (!key) return

    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open())
      }
    }

    document.addEventListener('keydown', handler)
    onCleanup(() => document.removeEventListener('keydown', handler))
  })

  return (
    <CommandDialog
      open={open()}
      onOpenChange={setOpen}
      title={props.title ?? 'Command Palette'}
      description={props.description ?? 'Search for commands'}
    >
      <CommandInput placeholder={locale().placeholder} onValueChange={v => props.onSearch?.(v)} />
      <CommandList>
        <CommandEmpty>{locale().noResults}</CommandEmpty>
        <For each={props.groups}>
          {(group, groupIndex) => (
            <>
              <Show when={groupIndex() > 0}>
                <CommandSeparator />
              </Show>
              <CommandGroup heading={group.label}>
                <For each={group.items}>
                  {item => (
                    <CommandItem
                      disabled={item.disabled}
                      onSelect={() => {
                        item.onSelect?.()
                        setOpen(false)
                      }}
                    >
                      <Show when={item.icon}>{item.icon}</Show>
                      <span>{item.label}</span>
                      <Show when={item.shortcut}>
                        <CommandShortcut>
                          <Kbd>{item.shortcut}</Kbd>
                        </CommandShortcut>
                      </Show>
                    </CommandItem>
                  )}
                </For>
              </CommandGroup>
            </>
          )}
        </For>
      </CommandList>
    </CommandDialog>
  )
}
