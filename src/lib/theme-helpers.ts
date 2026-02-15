import { useContext } from 'solid-js'
import type { ComponentPropsFor } from './component-props-map'
import { type ComponentName, ThemeContext } from './theme-context'

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
