import { useLocation, useNavigate } from '@solidjs/router'
import type { JSX } from 'solid-js'
import { type Component, Suspense } from 'solid-js'
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBell,
  IconCreditCard,
  IconFile,
  IconFullscreen,
  IconHash,
  IconHome,
  IconInbox,
  IconRocket,
  IconSettings,
  IconStar,
  IconUpdates,
} from 'shadcn-solid-components/components/icons'
import { Skeleton } from 'shadcn-solid-components/components/skeleton'
import { AppSidebar, type AppSidebarMenuGroup } from 'shadcn-solid-components/hoc/app-sidebar'
import {
  CommandPalette,
  type CommandPaletteGroup,
} from 'shadcn-solid-components/hoc/command-palette'
import { SidebarMenuTreeItem } from 'shadcn-solid-components/hoc/sidebar-menu-tree'
import { GetHelpIcon, HeaderIcon, SettingsIcon } from './components/icons'

interface AppProps {
  children?: JSX.Element
}

const App: Component<AppProps> = props => {
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = () => location.pathname
  const isActive = (path: string) => {
    const p = pathname()
    if (path === '/') return p === '/' || p === ''
    return p === path || p === `${path}/`
  }

  const makeFooterMenus = (navigate: (path: string) => void): SidebarMenuTreeItem[] => [
    {
      icon: () => <SettingsIcon />,
      title: 'Settings',
      get isActive() {
        return isActive('/settings')
      },
      onClick: () => navigate('/settings'),
    },
    {
      icon: () => <GetHelpIcon />,
      title: 'Get Help',
      onClick: () => {},
    },
  ]

  const menus: AppSidebarMenuGroup[] = [
    {
      group: 'Base Components',
      items: [
        {
          icon: () => <IconRocket class="size-4" />,
          title: 'General',
          get isActive() {
            return isActive('/general')
          },
          onClick: () => navigate('/general'),
        },
        {
          icon: () => <IconFullscreen class="size-4" />,
          title: 'Layout',
          get isActive() {
            return isActive('/layout')
          },
          onClick: () => navigate('/layout'),
        },
        {
          icon: () => <IconArrowRight class="size-4" />,
          title: 'Navigation',
          get isActive() {
            return isActive('/navigation')
          },
          onClick: () => navigate('/navigation'),
        },
        {
          icon: () => <IconFile class="size-4" />,
          title: 'Form Inputs',
          get isActive() {
            return isActive('/form-inputs')
          },
          onClick: () => navigate('/form-inputs'),
        },
        {
          icon: () => <IconInbox class="size-4" />,
          title: 'Data Display',
          get isActive() {
            return isActive('/data-display')
          },
          onClick: () => navigate('/data-display'),
        },
        {
          icon: () => <IconAlertTriangle class="size-4" />,
          title: 'Overlay & Feedback',
          get isActive() {
            return isActive('/overlay')
          },
          onClick: () => navigate('/overlay'),
        },
      ],
    },
    {
      group: 'Composites',
      items: [
        {
          icon: () => <IconHome class="size-4" />,
          title: 'Dashboard',
          get isActive() {
            return isActive('/') || isActive('/dashboard')
          },
          onClick: () => navigate('/'),
        },
        {
          icon: () => <IconHash class="size-4" />,
          title: 'Tables',
          get isActive() {
            return isActive('/tables')
          },
          onClick: () => navigate('/tables'),
        },
        {
          icon: () => <IconCreditCard class="size-4" />,
          title: 'Form Composites',
          get isActive() {
            return isActive('/forms-composite')
          },
          onClick: () => navigate('/forms-composite'),
        },
        {
          icon: () => <IconBell class="size-4" />,
          title: 'Feedback',
          get isActive() {
            return isActive('/feedback')
          },
          onClick: () => navigate('/feedback'),
        },
        {
          icon: () => <IconStar class="size-4" />,
          title: 'Display Composites',
          get isActive() {
            return isActive('/display-composite')
          },
          onClick: () => navigate('/display-composite'),
        },
        {
          icon: () => <IconSettings class="size-4" />,
          title: 'Custom Theme',
          get isActive() {
            return isActive('/custom-theme')
          },
          onClick: () => navigate('/custom-theme'),
        },
        {
          icon: () => <IconUpdates class="size-4" />,
          title: 'Activity Feed',
          get isActive() {
            return isActive('/activity-feed')
          },
          onClick: () => navigate('/activity-feed'),
        },
      ],
    },
  ]

  const commandPaletteGroups: CommandPaletteGroup[] = [
    {
      label: 'Base Components',
      items: [
        {
          id: 'general',
          label: 'General',
          icon: <IconRocket class="size-4" />,
          onSelect: () => navigate('/general'),
        },
        {
          id: 'layout',
          label: 'Layout',
          icon: <IconFullscreen class="size-4" />,
          onSelect: () => navigate('/layout'),
        },
        {
          id: 'navigation',
          label: 'Navigation',
          icon: <IconArrowRight class="size-4" />,
          onSelect: () => navigate('/navigation'),
        },
        {
          id: 'form-inputs',
          label: 'Form Inputs',
          icon: <IconFile class="size-4" />,
          onSelect: () => navigate('/form-inputs'),
        },
        {
          id: 'data-display',
          label: 'Data Display',
          icon: <IconInbox class="size-4" />,
          onSelect: () => navigate('/data-display'),
        },
        {
          id: 'overlay',
          label: 'Overlay & Feedback',
          icon: <IconAlertTriangle class="size-4" />,
          onSelect: () => navigate('/overlay'),
        },
      ],
    },
    {
      label: 'Composites',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <IconHome class="size-4" />,
          onSelect: () => navigate('/'),
        },
        {
          id: 'tables',
          label: 'Tables',
          icon: <IconHash class="size-4" />,
          onSelect: () => navigate('/tables'),
        },
        {
          id: 'forms-composite',
          label: 'Form Composites',
          icon: <IconCreditCard class="size-4" />,
          onSelect: () => navigate('/forms-composite'),
        },
        {
          id: 'feedback',
          label: 'Feedback',
          icon: <IconBell class="size-4" />,
          onSelect: () => navigate('/feedback'),
        },
        {
          id: 'display-composite',
          label: 'Display Composites',
          icon: <IconStar class="size-4" />,
          onSelect: () => navigate('/display-composite'),
        },
        {
          id: 'custom-theme',
          label: 'Custom Theme',
          icon: <IconSettings class="size-4" />,
          onSelect: () => navigate('/custom-theme'),
        },
        {
          id: 'activity-feed',
          label: 'Activity Feed',
          icon: <IconUpdates class="size-4" />,
          onSelect: () => navigate('/activity-feed'),
        },
      ],
    },
    {
      label: 'Actions',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: <IconSettings class="size-4" />,
          shortcut: '⌘,',
          onSelect: () => navigate('/settings'),
        },
      ],
    },
  ]

  return (
    <>
      <CommandPalette groups={commandPaletteGroups} />
      <AppSidebar
        header={{
          icon: <HeaderIcon />,
          title: 'Shadcn Solid',
        }}
        menus={menus}
        footer={makeFooterMenus(navigate)}
        body={
          <Suspense
            fallback={
              <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Skeleton class="h-[200px] rounded-xl" />
                <Skeleton class="h-[200px] rounded-xl" />
              </div>
            }
          >
            {props.children}
          </Suspense>
        }
      />
    </>
  )
}

export default App
