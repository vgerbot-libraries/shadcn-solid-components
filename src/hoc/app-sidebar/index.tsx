import { ComponentProps, For, type JSX, Match, Switch } from 'solid-js'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProps,
  SidebarProvider,
} from 'shadcn-solid-components/components/sidebar'
import { SidebarMenuTree, SidebarMenuTreeProps } from '../sidebar-menu-tree'

export type AppSidebarMenuGroup = {
  group: string
  items: SidebarMenuTreeProps['items']
}

export type AppSidebarProps = ComponentProps<'div'> & {
  sidebarProps?: SidebarProps
  header: AppSidebarHeaderProps | JSX.Element
  menus: AppSidebarMenuGroup[]
  footer: JSX.Element | SidebarMenuTreeProps['items']
  body: JSX.Element
}

export type AppSidebarHeaderProps = {
  icon: JSX.Element
  title: string
}

export function AppSidebar(props: AppSidebarProps) {
  const { header } = props
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" {...props.sidebarProps} collapsible="icon">
        <SidebarHeader>
          <Switch fallback={header as JSX.Element}>
            <Match when={isPresetHeader(header)}>
              <div class="flex items-center gap-2 px-2 py-1.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-primary">
                  {(header as AppSidebarHeaderProps).icon}
                </div>
                <div class="flex flex-col min-w-0 transition-opacity duration-150 delay-[200ms] group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:delay-0">
                  <span class="text-sm font-semibold">
                    {(header as AppSidebarHeaderProps).title}
                  </span>
                </div>
              </div>
            </Match>
          </Switch>
        </SidebarHeader>
        <SidebarContent>
          <For each={props.menus}>
            {menu => (
              <SidebarGroup>
                <SidebarGroupLabel>{menu.group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenuTree items={menu.items}></SidebarMenuTree>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </For>
        </SidebarContent>
        <SidebarFooter>
          <Switch fallback={props.footer as JSX.Element}>
            <Match when={Array.isArray(props.footer)}>
              <SidebarMenuTree
                items={props.footer as SidebarMenuTreeProps['items']}
              ></SidebarMenuTree>
            </Match>
          </Switch>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{props.body}</SidebarInset>
    </SidebarProvider>
  )
}

export function isPresetHeader(header: AppSidebarProps['header']): header is AppSidebarHeaderProps {
  return !!header && typeof header === 'object' && 'icon' in header && 'title' in header
}
