import { render } from 'solid-js/web'
import './styles.css'
import App from './App'
import { ColorModeProvider } from '@kobalte/core'
import { ThemeProvider } from '../src/components/theme'

render(() => {
  return (
    <ColorModeProvider>
      <ThemeProvider defaultTheme={{ base: { radius: 'none' } }} storageKey="shadcn-solid-theme">
        <App />
      </ThemeProvider>
    </ColorModeProvider>
  )
}, document.getElementById('root')!)
