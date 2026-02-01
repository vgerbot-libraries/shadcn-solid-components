import { useContext } from 'solid-js'
import type { ComponentPropsFor } from './component-props-map'
import { type ComponentName, type RadiusValue, ThemeContext } from './theme-context'
import type { ComponentCategory } from './use-theme'

// Radius mapping for different component categories
const radiusMapping: Record<RadiusValue, Record<ComponentCategory, string>> = {
  none: {
    'form-control': 'rounded-none',
    display: 'rounded-none',
    overlay: 'rounded-none',
    navigation: 'rounded-none',
    'menu-item': 'rounded-none',
    special: 'rounded-none',
  },
  sm: {
    'form-control': 'rounded-sm',
    display: 'rounded-md',
    overlay: 'rounded-sm',
    navigation: 'rounded-sm',
    'menu-item': 'rounded-sm',
    special: 'rounded-sm',
  },
  md: {
    'form-control': 'rounded-md',
    display: 'rounded-lg',
    overlay: 'rounded-md',
    navigation: 'rounded-md',
    'menu-item': 'rounded-sm',
    special: 'rounded-md',
  },
  lg: {
    'form-control': 'rounded-lg',
    display: 'rounded-xl',
    overlay: 'rounded-lg',
    navigation: 'rounded-lg',
    'menu-item': 'rounded-sm',
    special: 'rounded-lg',
  },
  xl: {
    'form-control': 'rounded-xl',
    display: 'rounded-2xl',
    overlay: 'rounded-xl',
    navigation: 'rounded-xl',
    'menu-item': 'rounded-sm',
    special: 'rounded-xl',
  },
  full: {
    'form-control': 'rounded-full',
    display: 'rounded-3xl',
    overlay: 'rounded-2xl',
    navigation: 'rounded-2xl',
    'menu-item': 'rounded-sm',
    special: 'rounded-full',
  },
}

// Default radius values when ThemeProvider is not used
const defaultRadius: Record<ComponentCategory, string> = {
  'form-control': 'rounded-md',
  display: 'rounded-lg',
  overlay: 'rounded-md',
  navigation: 'rounded-md',
  'menu-item': 'rounded-sm',
  special: 'rounded-md',
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
export function useRadiusClassPartial(category: ComponentCategory, side: 'top' | 'bottom'): string {
  const fullRadiusClass = useRadiusClass(category)

  // Convert full radius class to partial (e.g., rounded-lg -> rounded-t-lg or rounded-b-lg)
  if (fullRadiusClass === 'rounded-none') {
    return 'rounded-none'
  }

  const radiusValue = fullRadiusClass.replace('rounded-', '')
  return side === 'top' ? `rounded-t-${radiusValue}` : `rounded-b-${radiusValue}`
}

/**
 * Map radius classes to conditional classes with a prefix.
 * Useful for components that need radius classes with conditional prefixes (e.g., Tailwind responsive/state variants).
 */
const radiusClassMap: Record<string, string> = {
  'rounded-none': 'rounded-none',
  'rounded-sm': 'rounded-sm',
  'rounded-md': 'rounded-md',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
  'rounded-3xl': 'rounded-3xl',
  'rounded-full': 'rounded-full',
}

/**
 * Get the radius class for a component category with an optional prefix.
 * The prefix will be prepended to the radius class (e.g., 'md:peer-data-[variant=inset]:' + 'rounded-lg').
 * Useful for components that need conditional radius classes.
 */
export function useRadiusClassWithPrefix(category: ComponentCategory, prefix: string = ''): string {
  const radiusClass = useRadiusClass(category)
  const baseClass = radiusClassMap[radiusClass] || 'rounded-xl' // fallback

  return prefix ? `${prefix}${baseClass}` : baseClass
}

/**
 * Get component-specific classes from theme config.
 * Supports both function and object form of componentClass.
 * @param componentName - The name of the component (use ComponentName enum)
 * @param props - The props received by the component (type-safe based on componentName)
 * @returns The tailwindcss class list returned by the callback, or undefined if not configured
 */
export function useComponentClass<N extends ComponentName>(
  componentName: N,
  props: ComponentPropsFor<N>,
): string | undefined {
  const context = useContext(ThemeContext)

  if (!context) {
    return undefined
  }

  const componentClass = context.theme.componentClass

  if (!componentClass) {
    return undefined
  }

  if (typeof componentClass === 'function') {
    return componentClass(componentName, props)
  }

  const classFn = componentClass[componentName]
  return classFn ? classFn(props) : undefined
}
