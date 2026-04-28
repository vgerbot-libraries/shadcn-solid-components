import { For } from "solid-js"

import {
  DualSidebar,
  DualSidebarInset,
  DualSidebarMenu,
  DualSidebarMenuButton,
  DualSidebarMenuItem,
  DualSidebarPanel,
  DualSidebarPanelContent,
  DualSidebarPanelHeader,
  DualSidebarPanelTitle,
  DualSidebarProvider,
  DualSidebarRail,
  DualSidebarRailContent,
  DualSidebarRailFooter,
  DualSidebarRailHeader,
  DualSidebarRailItem,
  DualSidebarSection,
  DualSidebarTrigger,
} from "shadcn-solid-components/components/dual-sidebar"

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </g>
  </svg>
)

const AppsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </g>
  </svg>
)

const PagesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </g>
  </svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2" />
      <circle cx="12" cy="12" r="3" />
    </g>
  </svg>
)

const sections = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    items: ["Overview", "Analytics", "Reports"],
  },
  {
    key: "apps",
    label: "Apps",
    icon: AppsIcon,
    items: ["Contacts", "Chats", "Calendar", "Email"],
  },
  {
    key: "pages",
    label: "Pages",
    icon: PagesIcon,
    items: ["Landing", "Pricing", "About", "FAQ"],
  },
]

const DualSidebarDemo = () => {
  return (
    <div class="overflow-hidden rounded-lg border">
      <DualSidebarProvider defaultActiveKey="dashboard" class="min-h-[420px]">
        <DualSidebar>
          <DualSidebarRail>
            <DualSidebarRailHeader>
              <div class="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                S
              </div>
            </DualSidebarRailHeader>
            <DualSidebarRailContent>
              <For each={sections}>
                {(section) => (
                  <DualSidebarRailItem
                    sectionKey={section.key}
                    tooltip={section.label}
                  >
                    <section.icon />
                  </DualSidebarRailItem>
                )}
              </For>
            </DualSidebarRailContent>
            <DualSidebarRailFooter>
              <DualSidebarRailItem tooltip="Settings">
                <SettingsIcon />
              </DualSidebarRailItem>
            </DualSidebarRailFooter>
          </DualSidebarRail>

          <DualSidebarPanel>
            <For each={sections}>
              {(section) => (
                <DualSidebarSection sectionKey={section.key}>
                  <DualSidebarPanelHeader>
                    <DualSidebarPanelTitle>
                      {section.label}
                    </DualSidebarPanelTitle>
                  </DualSidebarPanelHeader>
                  <DualSidebarPanelContent>
                    <DualSidebarMenu>
                      <For each={section.items}>
                        {(item, index) => (
                          <DualSidebarMenuItem>
                            <DualSidebarMenuButton isActive={index() === 0}>
                              <span>{item}</span>
                            </DualSidebarMenuButton>
                          </DualSidebarMenuItem>
                        )}
                      </For>
                    </DualSidebarMenu>
                  </DualSidebarPanelContent>
                </DualSidebarSection>
              )}
            </For>
          </DualSidebarPanel>

          <DualSidebarInset>
            <header class="flex h-12 items-center gap-2 border-b px-3">
              <DualSidebarTrigger />
              <span class="text-sm font-medium">Workspace</span>
            </header>
            <main class="flex flex-1 flex-col gap-2 p-4">
              <div class="h-3 w-2/3 rounded bg-muted" />
              <div class="h-3 w-1/2 rounded bg-muted" />
              <div class="h-3 w-3/4 rounded bg-muted" />
            </main>
          </DualSidebarInset>
        </DualSidebar>
      </DualSidebarProvider>
    </div>
  )
}

export default DualSidebarDemo
