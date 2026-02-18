import { render } from 'solid-js/web'
import { lazy } from 'solid-js'
import './styles.css'
import App from './App'
import { ColorModeProvider } from '@kobalte/core'
import { ThemeProvider } from '../src/components/theme'
import { Toaster } from '../src/components/sonner'
import { ConfirmDialog } from '../src/hoc/confirm-dialog'
import { Router, Route } from '@solidjs/router'

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

const Root = (props: { children: import('solid-js').JSX.Element }) => (
  <ColorModeProvider>
    <ThemeProvider defaultTheme={{ base: { radius: 'md' } }} storageKey="shadcn-solid-theme">
      <App>{props.children}</App>
      <Toaster />
      <ConfirmDialog />
    </ThemeProvider>
  </ColorModeProvider>
)

render(() => {
  return (
    <Router root={Root}>
      <Route path="/" component={DashboardPage} />
      <Route path="/general" component={GeneralPage} />
      <Route path="/layout" component={LayoutPage} />
      <Route path="/navigation" component={NavigationPage} />
      <Route path="/form-inputs" component={FormInputsPage} />
      <Route path="/data-display" component={DataDisplayPage} />
      <Route path="/overlay" component={OverlayPage} />
      <Route path="/tables" component={TablesPage} />
      <Route path="/forms-composite" component={FormsCompositePage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/display-composite" component={DisplayCompositePage} />
    </Router>
  )
}, document.getElementById('root')!)
