import { useColorMode } from '@kobalte/core'
import { ComponentProps } from 'solid-js'
import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { IconLaptop, IconMoon, IconSun } from '@/components/icons'
import { cx } from '@/lib'

/** All translatable strings used by ModeToggleDropdown. */
export interface ModeToggleDropdownLocale {
  /** Screen-reader label for the trigger button. */
  toggleTheme: string
  /** Label for the light mode option. */
  light: string
  /** Label for the dark mode option. */
  dark: string
  /** Label for the system/auto mode option. */
  system: string
}

/** English (default) */
export const enLocale: ModeToggleDropdownLocale = {
  toggleTheme: 'Toggle theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

/** 简体中文 */
export const zhCNLocale: ModeToggleDropdownLocale = {
  toggleTheme: '切换主题',
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
}

/** 繁體中文 */
export const zhTWLocale: ModeToggleDropdownLocale = {
  toggleTheme: '切換主題',
  light: '淺色',
  dark: '深色',
  system: '跟隨系統',
}

/** 日本語 */
export const jaLocale: ModeToggleDropdownLocale = {
  toggleTheme: 'テーマを切り替え',
  light: 'ライト',
  dark: 'ダーク',
  system: 'システム',
}

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
  const locale = (): ModeToggleDropdownLocale => ({ ...enLocale, ...props.locale })

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
