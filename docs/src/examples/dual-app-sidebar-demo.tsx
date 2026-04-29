import { DualAppSidebar } from "shadcn-solid-components/hoc/dual-app-sidebar"

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

const DualAppSidebarDemo = () => {
  return (
    <div class="overflow-hidden rounded-lg border">
      <DualAppSidebar
        class="min-h-[420px]"
        header={{
          icon: <span class="text-xs font-bold">S</span>,
          title: "Studio",
        }}
        sections={[
          {
            key: "dashboard",
            label: "Dashboard",
            icon: <DashboardIcon />,
            menus: [
              {
                group: "Overview",
                items: [
                  { title: "Overview", url: "/" },
                  { title: "Analytics", url: "/analytics" },
                  { title: "Reports", url: "/reports" },
                ],
              },
            ],
          },
          {
            key: "apps",
            label: "Apps",
            icon: <AppsIcon />,
            menus: [
              {
                group: "Communication",
                items: [
                  { title: "Contacts", url: "/contacts" },
                  { title: "Chats", url: "/chats" },
                  { title: "Calendar", url: "/calendar" },
                  { title: "Email", url: "/email" },
                ],
              },
            ],
          },
          {
            key: "pages",
            label: "Pages",
            icon: <PagesIcon />,
            menus: [
              {
                group: "Content",
                items: [
                  { title: "Landing", url: "/landing" },
                  { title: "Pricing", url: "/pricing" },
                  { title: "About", url: "/about" },
                ],
              },
            ],
            footer: [{ title: "FAQ", url: "/faq" }],
          },
        ]}
        railFooter={[
          { icon: <SettingsIcon />, tooltip: "Settings", onClick: () => {} },
        ]}
        defaultActiveKey="dashboard"
        body={
          <main class="flex flex-1 flex-col gap-2 p-4">
            <div class="h-3 w-2/3 rounded bg-muted" />
            <div class="h-3 w-1/2 rounded bg-muted" />
            <div class="h-3 w-3/4 rounded bg-muted" />
          </main>
        }
      />
    </div>
  )
}

export default DualAppSidebarDemo
