import { useContext } from 'solid-js'
import { ThemeContext, type RadiusValue } from './theme-context'
import type { ComponentCategory } from './use-theme'

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

// Default radius values when ThemeProvider is not used
const defaultRadius: Record<ComponentCategory, string> = {
  'form-control': 'rounded-md',
  'display': 'rounded-lg',
  'overlay': 'rounded-md',
  'navigation': 'rounded-md',
  'special': 'rounded-md',
}

/**
 * Get the radius class for a component category.
 * Works with or without ThemeProvider for backward compatibility.
 */
export function useRadiusClass(category: ComponentCategory): string {
  const context = useContext(ThemeContext)

  if (!context) {
    // Fallback to default when ThemeProvider is not used
    return defaultRadius[category]
  }

  const radius = context.theme.base.radius
  return radiusMapping[radius][category]
}

/**
 * Get the partial radius class for a component category (top or bottom only).
 * Useful for components like drawer that only need partial rounding.
 */
export function useRadiusClassPartial(
  category: ComponentCategory,
  side: 'top' | 'bottom',
): string {
  const fullRadiusClass = useRadiusClass(category)

  // Convert full radius class to partial (e.g., rounded-lg -> rounded-t-lg or rounded-b-lg)
  if (fullRadiusClass === 'rounded-none') {
    return 'rounded-none'
  }

  const radiusValue = fullRadiusClass.replace('rounded-', '')
  return side === 'top' ? `rounded-t-${radiusValue}` : `rounded-b-${radiusValue}`
}
