import type { Locale } from 'shadcn-solid-components/i18n/types'
import { createContext, type JSX, useContext } from 'solid-js'

const LocaleContext = createContext<Partial<Locale>>({})

export interface ConfigProviderProps {
  /** The global locale object to use for all components. */
  locale?: Partial<Locale>
  children: JSX.Element
}

/**
 * A global configuration provider for shadcn-solid-components.
 *
 * @example
 * ```tsx
 * import { ConfigProvider } from 'shadcn-solid-components'
 * import { zhCN } from 'shadcn-solid-components/i18n/locales/zh-CN'
 *
 * <ConfigProvider locale={zhCN}>
 *   <App />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider(props: ConfigProviderProps) {
  return (
    <LocaleContext.Provider value={props.locale ?? {}}>{props.children}</LocaleContext.Provider>
  )
}

/**
 * Access the global locale context.
 * Returns an empty object if used outside a ConfigProvider.
 */
export function useLocale(): Partial<Locale> {
  return useContext(LocaleContext)
}
