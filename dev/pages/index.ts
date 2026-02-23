import { lazy, type Component } from 'solid-js'

export const pages: Record<string, Component> = {
  dashboard: lazy(() => import('./DashboardPage')),
  general: lazy(() => import('./GeneralPage')),
  layout: lazy(() => import('./LayoutPage')),
  navigation: lazy(() => import('./NavigationPage')),
  'form-inputs': lazy(() => import('./FormInputsPage')),
  'data-display': lazy(() => import('./DataDisplayPage')),
  overlay: lazy(() => import('./OverlayPage')),
  tables: lazy(() => import('./TablesPage')),
  'forms-composite': lazy(() => import('./FormsCompositePage')),
  feedback: lazy(() => import('./FeedbackPage')),
  'display-composite': lazy(() => import('./DisplayCompositePage')),
  settings: lazy(() => import('./SettingsPage')),
}
