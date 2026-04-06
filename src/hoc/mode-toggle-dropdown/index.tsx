import { useColorMode } from '@kobalte/core'
import { ComponentProps } from 'solid-js'
import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'shadcn-solid-components/components/dropdown-menu'
import { IconLaptop, IconMoon, IconSun } from 'shadcn-solid-components/components/icons'
import type { ModeToggleDropdownLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { enUS as defaultLocale } from './locales/en-US'

/** All translatable strings used by ModeToggleDropdown. */

/** English (default) */

/** 简体中文 */

/** 繁體中文 */

/** 日本語 */

// ============================================================================
// Component
// ============================================================================

export type ModeToggleDropdownProps = {
  trigger?: ComponentProps<typeof Button>
  /** Locale overrides. Merged with the default English locale. */
  locale?: Partial<ModeToggleDropdownLocale>
}

export function ModeToggleDropdown(props: ModeToggleDropdownProps) {
  const { setColorMode } = useColorMode()
  const globalLocale = useLocale()
  const locale = (): ModeToggleDropdownLocale => ({
    ...defaultLocale,
    ...globalLocale.ModeToggleDropdown,
    ...props.locale,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<'button'>}
        variant="ghost"
        size="sm"
        {...props.trigger}
        class={cx('w-9 px-0', props.trigger?.class)}
      >
        <IconSun class="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <IconMoon class="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">{locale().toggleTheme}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode('light')}>
          <IconSun class="mr-2 size-4" />
          <span>{locale().light}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode('dark')}>
          <IconMoon class="mr-2 size-4" />
          <span>{locale().dark}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode('system')}>
          <IconLaptop class="mr-2 size-4" />
          <span>{locale().system}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
