import { useColorMode } from '@kobalte/core'
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { Button } from 'shadcn-solid-components/components/button'
import { IconMoon, IconSun } from 'shadcn-solid-components/components/icons'
import { cx } from 'shadcn-solid-components/lib/cva'

export type ModeToggleGroupProps = ComponentProps<'div'> & {
  lightLabel?: string
  darkLabel?: string
}

export function ModeToggleGroup(props: ModeToggleGroupProps) {
  const { colorMode, setColorMode } = useColorMode()
  const [local, rest] = splitProps(props, ['class', 'lightLabel', 'darkLabel'])

  return (
    <div
      class={cx('bg-muted inline-flex items-center gap-1 rounded-component p-1', local.class)}
      {...rest}
    >
      <Button
        size="sm"
        variant={colorMode() === 'light' ? 'default' : 'ghost'}
        onClick={() => setColorMode('light')}
      >
        <IconSun class="size-4" />
        {local.lightLabel ?? 'Light'}
      </Button>
      <Button
        size="sm"
        variant={colorMode() === 'dark' ? 'default' : 'ghost'}
        onClick={() => setColorMode('dark')}
      >
        <IconMoon class="size-4" />
        {local.darkLabel ?? 'Dark'}
      </Button>
    </div>
  )
}
