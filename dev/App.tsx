import { type Component, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { AppSidebar, type AppSidebarMenuGroup } from '@/hoc/app-sidebar'
import { CommandPalette, type CommandPaletteGroup } from '@/hoc/command-palette'
import { SidebarMenuTreeItem } from '@/hoc/sidebar-menu-tree'
import {
  IconHome,
  IconSettings,
  IconSearch,
  IconFile,
  IconUsers,
  IconRocket,
  IconFullscreen,
  IconArrowRight,
  IconHash,
  IconInbox,
  IconAlertTriangle,
  IconStar,
  IconBell,
  IconCircleCheck,
  IconCreditCard,
} from '@/components/icons'
import { Skeleton } from '@/components/skeleton'
import {
  SettingsIcon,
  GetHelpIcon,
  HeaderIcon,
} from './components/icons'
import { currentPage, setCurrentPage } from './context'
import { pages } from './pages'

const menus: AppSidebarMenuGroup[] = [
  {
    group: 'Base Components',
    items: [
      {
        icon: () => <IconRocket class="size-4" />,
        title: 'General',
        get isActive() { return currentPage() === 'general' },
        onClick: () => setCurrentPage('general'),
      },
      {
        icon: () => <IconFullscreen class="size-4" />,
        title: 'Layout',
        get isActive() { return currentPage() === 'layout' },
        onClick: () => setCurrentPage('layout'),
      },
      {
        icon: () => <IconArrowRight class="size-4" />,
        title: 'Navigation',
        get isActive() { return currentPage() === 'navigation' },
        onClick: () => setCurrentPage('navigation'),
      },
      {
        icon: () => <IconFile class="size-4" />,
        title: 'Form Inputs',
        get isActive() { return currentPage() === 'form-inputs' },
        onClick: () => setCurrentPage('form-inputs'),
      },
      {
        icon: () => <IconInbox class="size-4" />,
        title: 'Data Display',
        get isActive() { return currentPage() === 'data-display' },
        onClick: () => setCurrentPage('data-display'),
      },
      {
        icon: () => <IconAlertTriangle class="size-4" />,
        title: 'Overlay & Feedback',
        get isActive() { return currentPage() === 'overlay' },
        onClick: () => setCurrentPage('overlay'),
      },
    ],
  },
  {
    group: 'Composites',
    items: [
      {
        icon: () => <IconHome class="size-4" />,
        title: 'Dashboard',
        get isActive() { return currentPage() === 'dashboard' },
        onClick: () => setCurrentPage('dashboard'),
      },
      {
        icon: () => <IconHash class="size-4" />,
        title: 'Tables',
        get isActive() { return currentPage() === 'tables' },
        onClick: () => setCurrentPage('tables'),
      },
      {
        icon: () => <IconCreditCard class="size-4" />,
        title: 'Form Composites',
        get isActive() { return currentPage() === 'forms-composite' },
        onClick: () => setCurrentPage('forms-composite'),
      },
      {
        icon: () => <IconBell class="size-4" />,
        title: 'Feedback',
        get isActive() { return currentPage() === 'feedback' },
        onClick: () => setCurrentPage('feedback'),
      },
      {
        icon: () => <IconStar class="size-4" />,
        title: 'Display Composites',
        get isActive() { return currentPage() === 'display-composite' },
        onClick: () => setCurrentPage('display-composite'),
      },
    ],
  },
]

const footerMenus: SidebarMenuTreeItem[] = [
  {
    icon: () => <SettingsIcon />,
    title: 'Settings',
    onClick: () => {},
  },
  {
    icon: () => <GetHelpIcon />,
    title: 'Get Help',
    onClick: () => {},
  },
]

const commandPaletteGroups: CommandPaletteGroup[] = [
  {
    label: 'Base Components',
    items: [
      { id: 'general', label: 'General', icon: <IconRocket class="size-4" />, onSelect: () => setCurrentPage('general') },
      { id: 'layout', label: 'Layout', icon: <IconFullscreen class="size-4" />, onSelect: () => setCurrentPage('layout') },
      { id: 'navigation', label: 'Navigation', icon: <IconArrowRight class="size-4" />, onSelect: () => setCurrentPage('navigation') },
      { id: 'form-inputs', label: 'Form Inputs', icon: <IconFile class="size-4" />, onSelect: () => setCurrentPage('form-inputs') },
      { id: 'data-display', label: 'Data Display', icon: <IconInbox class="size-4" />, onSelect: () => setCurrentPage('data-display') },
      { id: 'overlay', label: 'Overlay & Feedback', icon: <IconAlertTriangle class="size-4" />, onSelect: () => setCurrentPage('overlay') },
    ],
  },
  {
    label: 'Composites',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <IconHome class="size-4" />, onSelect: () => setCurrentPage('dashboard') },
      { id: 'tables', label: 'Tables', icon: <IconHash class="size-4" />, onSelect: () => setCurrentPage('tables') },
      { id: 'forms-composite', label: 'Form Composites', icon: <IconCreditCard class="size-4" />, onSelect: () => setCurrentPage('forms-composite') },
      { id: 'feedback', label: 'Feedback', icon: <IconBell class="size-4" />, onSelect: () => setCurrentPage('feedback') },
      { id: 'display-composite', label: 'Display Composites', icon: <IconStar class="size-4" />, onSelect: () => setCurrentPage('display-composite') },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'settings', label: 'Settings', icon: <IconSettings class="size-4" />, shortcut: '⌘,' },
    ],
  },
]

const LoadingFallback = () => (
  <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
    <Skeleton class="h-8 w-48" />
    <Skeleton class="h-4 w-96" />
    <div class="grid gap-4 md:grid-cols-2">
      <Skeleton class="h-[200px] rounded-xl" />
      <Skeleton class="h-[200px] rounded-xl" />
    </div>
  </div>
)

const App: Component = () => {
  return (
    <>
      <CommandPalette groups={commandPaletteGroups} />
      <AppSidebar
        header={{
          icon: <HeaderIcon />,
          title: 'Shadcn Solid',
        }}
        menus={menus}
        footer={footerMenus}
        body={
          <Suspense fallback={<LoadingFallback />}>
            <Dynamic component={pages[currentPage()]} />
          </Suspense>
        }
      />
    </>
  )
}

export default App
