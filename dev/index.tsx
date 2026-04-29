import { For, lazy } from 'solid-js'
import { render } from 'solid-js/web'
import './styles.css'
import { ColorModeProvider } from '@kobalte/core'
import { Route, Router } from '@solidjs/router'
import { ConfigProvider } from '../src/components/config-provider'
import { Toaster } from '../src/components/sonner'
import { ThemeProvider } from '../src/components/theme'
import { ConfirmDialog } from '../src/hoc/confirm-dialog'
import App from './App'
import { globalLocale } from './store'
import { pages } from './pages'

export { globalLocale, setGlobalLocale } from './store'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const GeneralPage = lazy(() => import('./pages/GeneralPage'))
const LayoutPage = lazy(() => import('./pages/LayoutPage'))
const NavigationPage = lazy(() => import('./pages/NavigationPage'))
const FormInputsPage = lazy(() => import('./pages/FormInputsPage'))
const DataDisplayPage = lazy(() => import('./pages/DataDisplayPage'))
const OverlayPage = lazy(() => import('./pages/OverlayPage'))
const TablesPage = lazy(() => import('./pages/TablesPage'))
const FormsCompositePage = lazy(() => import('./pages/FormsCompositePage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const DisplayCompositePage = lazy(() => import('./pages/DisplayCompositePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const CustomThemePage = lazy(() => import('./pages/CustomThemePage'))
const ActivityFeedPage = lazy(() => import('./pages/ActivityFeedPage'))
const PricingTablePage = lazy(() => import('./pages/PricingTablePage'))
const HelperCenterPage = lazy(() => import('./pages/HelperCenterPage'))

const Root = (props: { children?: import('solid-js').JSX.Element }) => (
  <ColorModeProvider>
    <ThemeProvider defaultTheme={{ base: { radius: 'md' } }} storageKey="shadcn-solid-theme">
      <ConfigProvider locale={globalLocale()}>
        <App>{props.children}</App>
        <Toaster />
        <ConfirmDialog />
      </ConfigProvider>
    </ThemeProvider>
  </ColorModeProvider>
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
