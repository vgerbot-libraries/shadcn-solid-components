import { render } from 'solid-js/web'
import './styles.css'

import App from './App'
import { ColorModeProvider } from '@kobalte/core';

render(() => {
  return <ColorModeProvider>
    <App />
  </ColorModeProvider>

}, document.getElementById('root')!)
