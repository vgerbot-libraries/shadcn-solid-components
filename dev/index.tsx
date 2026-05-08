import { For, lazy } from 'solid-js'
import { render } from 'solid-js/web'
import './styles.css'
import { Route, Router } from '@solidjs/router'
import { Toaster } from '../src/components/sonner'
import { ConfirmDialog } from '../src/hoc/confirm-dialog'
import App from './App'
import { globalLocale } from './store'
import { pages } from './pages'
import { ShadcnRoot } from 'shadcn-solid-components/lib/ShadcnRoot'

export { globalLocale, setGlobalLocale } from './store'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))

const Root = (props: { children?: import('solid-js').JSX.Element }) => (
  <ShadcnRoot
    themeOptions={{
      defaultTheme: { base: { radius: 'md' } },
      storageKey: "shadcn-solid-theme"
    }
    }
    config={{
      locale: globalLocale()
    }}
  >
    <App>{props.children}</App>
    <Toaster />
    <ConfirmDialog />
  </ShadcnRoot>
)

const rootEl = document.getElementById('root')!
rootEl.textContent = ''

const dispose = render(() => {
  return (
    <Router root={Root}>
      <Route path="/" component={DashboardPage} />
      <For each={Object.keys(pages)}>
        {page => <Route path={`/${page}`} component={pages[page]} />}
      </For>
    </Router>
  )
}, rootEl)

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose())
}
