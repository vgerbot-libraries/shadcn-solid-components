import { type Component, type JSX } from 'solid-js'
import { PageLayout as PageLayoutPrimitive, PageLayoutHeader } from 'shadcn-solid-components/components/page-layout'
import { Separator } from 'shadcn-solid-components/components/separator'
import { SidebarTrigger } from 'shadcn-solid-components/components/sidebar'

interface DevPageLayoutProps {
  title: string
  description?: string
  actions?: JSX.Element
  children: JSX.Element
}

export const PageLayout: Component<DevPageLayoutProps> = props => {
  return (
    <PageLayoutPrimitive
      header={
        <PageLayoutHeader
          leading={
            <>
              <SidebarTrigger class="-ml-1" />
              <Separator orientation="vertical" class="mr-2 h-4" />
            </>
          }
          content={
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground text-sm">Press</span>
              <kbd class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded px-1.5 font-mono text-xs font-medium">
                <span class="text-xs">⌘</span>K
              </kbd>
              <span class="text-muted-foreground text-sm">to open command palette</span>
            </div>
          }
          actions={props.actions}
        />
      }
    >
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{props.title}</h2>
        {props.description && <p class="text-muted-foreground mt-1">{props.description}</p>}
      </div>
      {props.children}
    </PageLayoutPrimitive>
  )
}
