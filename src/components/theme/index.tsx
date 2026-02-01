import { createEffect, createSignal, type JSX } from 'solid-js'
import { type ThemeConfig, ThemeContext } from '../../lib/theme-context'

export interface ThemeProviderProps {
  children: JSX.Element
  defaultTheme?: ThemeConfig
  storageKey?: string // for localStorage persistence
}

const DEFAULT_THEME: ThemeConfig = {
  base: {
    radius: 'md',
  },
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const [theme, setThemeSignal] = createSignal<ThemeConfig>(props.defaultTheme ?? DEFAULT_THEME)

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeSignal(prev => ({
      ...prev,
      ...newTheme,
      base: {
        ...prev.base,
        ...(newTheme.base || {}),
      },
    }))
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: theme(),
        setTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  )
}
