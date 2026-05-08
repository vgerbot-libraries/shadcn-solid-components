import { PropsWithChildren } from 'solid-js'
import { ColorModeProvider, ColorModeProviderProps } from '@kobalte/core'
import { ThemeProviderProps, ThemeProvider } from '../components/theme'
import { ConfigProviderProps, ConfigProvider } from '../components/config-provider'

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
