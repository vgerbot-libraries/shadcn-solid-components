import type { Component } from 'solid-js'
import { AppSidebar, type AppSidebarMenuGroup } from '@/hoc/app-sidebar'
import { CommandPalette, type CommandPaletteGroup } from '@/hoc/command-palette'
import { IconHome, IconSettings, IconSearch, IconFile, IconUsers } from '@/components/icons'
import {
  DashboardIcon,
  LifecycleIcon,
  AnalyticsIcon,
  ProjectsIcon,
  TeamIcon,
  DataLibraryIcon,
  ReportsIcon,
  WordAssistantIcon,
  MoreIcon,
  SettingsIcon,
  GetHelpIcon,
  HeaderIcon,
} from './components/icons'
import { Main } from './components/Main'
import { SidebarMenuTreeItem } from '@/hoc/sidebar-menu-tree'

// Menu configuration
const menus: AppSidebarMenuGroup[] = [
  {
    group: 'Home',
    items: [
      {
        icon: () => <DashboardIcon />,
        title: 'Dashboard',
        isActive: true,
        onClick: () => {},
      },
      {
        icon: () => <LifecycleIcon />,
        title: 'Lifecycle',
        onClick: () => {
          alert('Lifecycle')
        },
      },
      {
        icon: () => <AnalyticsIcon />,
        title: 'Analytics',
        onClick: () => {},
      },
      {
        icon: () => <ProjectsIcon />,
        title: 'Projects',
        onClick: () => {},
        items: [
          {
            title: 'Project 1',
            icon: () => <ProjectsIcon />,
            onClick: () => {},
          },
          {
            title: 'Project 2',
            icon: () => <ProjectsIcon />,
            onClick: () => {},
          },
        ],
      },
      {
        icon: () => <TeamIcon />,
        title: 'Team',
        badge: {
          content: 10,
          variant: 'destructive',
        },
        onClick: () => {},
      },
    ],
  },
  {
    group: 'Documents',
    items: [
      {
        icon: () => <DataLibraryIcon />,
        title: 'Data Library',
        onClick: () => {},
      },
      {
        icon: () => <ReportsIcon />,
        title: 'Reports',
        onClick: () => {},
      },
      {
        icon: () => <WordAssistantIcon />,
        title: 'Word Assistant',
        onClick: () => {},
      },
      {
        icon: () => <MoreIcon />,
        title: 'More',
        onClick: () => {},
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
    label: 'Pages',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <IconHome class="size-4" /> },
      { id: 'analytics', label: 'Analytics', icon: <IconSearch class="size-4" /> },
      { id: 'team', label: 'Team', icon: <IconUsers class="size-4" /> },
      { id: 'reports', label: 'Reports', icon: <IconFile class="size-4" /> },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'settings', label: 'Settings', icon: <IconSettings class="size-4" />, shortcut: '⌘,' },
    ],
  },
]

const App: Component = () => {
  return (
    <>
      <CommandPalette groups={commandPaletteGroups} />
      <AppSidebar
        header={{
          icon: <HeaderIcon />,
          title: 'Acme Inc.',
        }}
        menus={menus}
        footer={footerMenus}
        body={<Main />}
      />
    </>
  )
}

export default App
