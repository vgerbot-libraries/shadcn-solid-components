import { useContext, createMemo } from 'solid-js'
import { ThemeContext, type ThemeConfig, type RadiusValue } from './theme-context'

export type ComponentCategory =
  | 'form-control'    // Button, Input, Select, Search, Combobox, Toggle Button, Badge, Tooltip
  | 'display'         // Card, Alert
  | 'overlay'         // Dialog, AlertDialog, Drawer, Popover
  | 'navigation'      // Tabs, Sidebar
  | 'special'         // Switch, Slider (always returns 'rounded-full')

export interface UseThemeReturn {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  setRadius: (radius: RadiusValue) => void
  getRadiusClass: (category: ComponentCategory) => string
}

// Radius mapping for different component categories
const radiusMapping: Record<RadiusValue, Record<ComponentCategory, string>> = {
  none: {
    'form-control': 'rounded-none',
    'display': 'rounded-none',
    'overlay': 'rounded-none',
    'navigation': 'rounded-none',
    'special': 'rounded-none',
  },
  sm: {
    'form-control': 'rounded-sm',
    'display': 'rounded-md',
    'overlay': 'rounded-sm',
    'navigation': 'rounded-sm',
    'special': 'rounded-sm',
  },
  md: {
    'form-control': 'rounded-md',
    'display': 'rounded-lg',
    'overlay': 'rounded-md',
    'navigation': 'rounded-md',
    'special': 'rounded-md',
  },
  lg: {
    'form-control': 'rounded-lg',
    'display': 'rounded-xl',
    'overlay': 'rounded-lg',
    'navigation': 'rounded-lg',
    'special': 'rounded-lg',
  },
  xl: {
    'form-control': 'rounded-xl',
    'display': 'rounded-2xl',
    'overlay': 'rounded-xl',
    'navigation': 'rounded-xl',
    'special': 'rounded-xl',
  },
  full: {
    'form-control': 'rounded-full',
    'display': 'rounded-3xl',
    'overlay': 'rounded-2xl',
    'navigation': 'rounded-2xl',
    'special': 'rounded-full',
  },
}

export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  const setRadius = (radius: RadiusValue) => {
    context.setTheme({
      base: {
        radius,
      },
    })
  }

  const getRadiusClass = createMemo(() => {
    return (category: ComponentCategory): string => {
      const radius = context.theme.base.radius
      return radiusMapping[radius][category]
    }
  })

  return {
    theme: context.theme,
    setTheme: context.setTheme,
    setRadius,
    getRadiusClass: getRadiusClass(),
  }
}
