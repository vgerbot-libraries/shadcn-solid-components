import { AppSidebar } from "shadcn-solid-components/hoc/app-sidebar"
import { createSignal, Show } from "solid-js"

const AppSidebarDemo = () => {
  const [breadcrumb, setBreadcrumb] = createSignal<string[]>([])
  return (
    <div class="overflow-hidden rounded-lg border">
      <AppSidebar
        sidebarProps={{
          class: 'relative',
        }}
        header={{
          icon: <span class="text-sm font-bold">A</span>,
          title: "Acme",
        }}
        menus={[
          {
            group: "Main",
            items: [
              { title: "Dashboard", url: "/" },
              { title: "Projects", url: "/projects" },
            ],
          },
        ]}
        footer={[{ title: "Help", url: "/help" }]}
        onActiveKeyChange={(_key, path) => setBreadcrumb(path.map(p => p.title))}
        body={
          <main class="flex min-h-[220px] flex-1 flex-col gap-4 p-4">
            <Show when={breadcrumb().length > 0}>
              <nav class="text-sm text-muted-foreground">
                {breadcrumb().join(" / ")}
              </nav>
            </Show>
            <h1 class="text-lg font-semibold">Page</h1>
          </main>
        }
      />
    </div>
  )
}

export default AppSidebarDemo
