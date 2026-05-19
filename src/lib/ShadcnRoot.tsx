import { ColorModeProvider, ColorModeProviderProps } from '@kobalte/core'
import { PropsWithChildren } from 'solid-js'
import { ConfigProvider, ConfigProviderProps } from '../components/config-provider'
import { ThemeProvider, ThemeProviderProps } from '../components/theme'

export type ShadcnRootProps = PropsWithChildren<{
  colorModeOptions?: Omit<ColorModeProviderProps, 'children'>
  themeOptions?: Omit<ThemeProviderProps, 'children'>
  config?: Omit<ConfigProviderProps, 'children'>
}>

export function ShadcnRoot(props: ShadcnRootProps) {
  return (
    <ColorModeProvider {...(props.colorModeOptions ?? {})}>
      <ThemeProvider {...(props.themeOptions ?? {})}>
        <ConfigProvider {...(props.config ?? {})}>{props.children}</ConfigProvider>
      </ThemeProvider>
    </ColorModeProvider>
  )
}
