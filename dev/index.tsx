import { render } from 'solid-js/web'
import './styles.css'
import App from './App'
import { ColorModeProvider } from '@kobalte/core'
import { ThemeProvider } from '../src/components/theme'
import { Toaster } from '../src/components/sonner'
import { ConfirmDialog } from '../src/hoc/confirm-dialog'

render(() => {
  return (
    <ColorModeProvider>
      <ThemeProvider defaultTheme={{ base: { radius: 'md' } }} storageKey="shadcn-solid-theme">
        <App />
        <Toaster />
        <ConfirmDialog />
      </ThemeProvider>
    </ColorModeProvider>
  )
}, document.getElementById('root')!)
