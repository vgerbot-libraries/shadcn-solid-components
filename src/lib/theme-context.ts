import { createContext } from 'solid-js'

export type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ThemeConfig {
  base: {
    radius: RadiusValue
  }
  // Future: dark and light mode specific overrides
  dark?: {
    // theme-specific dark mode settings
  }
  light?: {
    // theme-specific light mode settings
  }
}

export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
}

export const ThemeContext = createContext<ThemeContextValue>()
