import { Sidebar, SidebarContent, SidebarProvider } from "shadcn-solid-components/components/sidebar"
import { IconHome, IconSettings } from "shadcn-solid-components/components/icons"
import { SidebarMenuTree } from "shadcn-solid-components/hoc/sidebar-menu-tree"

const SidebarMenuTreeDemo = () => {
  return (
    <SidebarProvider>
      <div class="w-full max-w-xs">
        <Sidebar collapsible="none" class="static h-auto w-full">
          <SidebarContent>
            <SidebarMenuTree
              currentUrl="/settings/profile"
              items={[
                {
                  title: "Home",
                  url: "/",
                  icon: () => <IconHome class="size-4" />,
                },
                {
                  title: "Settings",
                  url: "/settings",
                  icon: () => <IconSettings class="size-4" />,
                  defaultOpen: true,
                  items: [
                    {
                      title: "Profile",
                      url: "/settings/profile",
                      urlMatch: "startsWith",
                      badge: 3,
                    },
                  ],
                },
              ]}
            />
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}

export default SidebarMenuTreeDemo
