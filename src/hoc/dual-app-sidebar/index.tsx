import {
  DualSidebar,
  DualSidebarInset,
  DualSidebarPanel,
  DualSidebarPanelContent,
  DualSidebarPanelFooter,
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
} from 'shadcn-solid-components/components/dual-sidebar'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from 'shadcn-solid-components/components/sidebar'
import { AppSidebarHeaderProps, AppSidebarMenuGroup, isPresetHeader } from '../app-sidebar'
import { SidebarMenuTree, SidebarMenuTreeProps, type ActivePathItem } from '../sidebar-menu-tree'
import { ComponentProps, For, type JSX, Match, Show, Switch } from 'solid-js'

export type DualAppSidebarRailFooterItem = {
  icon: JSX.Element
  tooltip?: string
  sectionKey?: string
  onClick?: () => void
}

export type DualAppSidebarSection = {
  key: string
  label: string
  icon: JSX.Element
  tooltip?: string
  header?: JSX.Element
  menus: AppSidebarMenuGroup[]
  footer?: JSX.Element | SidebarMenuTreeProps['items']
}

export type DualAppSidebarProps = ComponentProps<'div'> & {
  header: AppSidebarHeaderProps | JSX.Element
  sections: DualAppSidebarSection[]
  railFooter?: DualAppSidebarRailFooterItem[] | JSX.Element
  body: JSX.Element
  defaultActiveKey?: string
  activeKey?: string
  onActiveKeyChange?: (key: string, path?: ActivePathItem[]) => void
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DualAppSidebar(props: DualAppSidebarProps) {
  const {
    header,
    sections,
    railFooter,
    body,
    defaultActiveKey,
    activeKey,
    onActiveKeyChange,
    defaultOpen,
    open,
    onOpenChange,
  } = props

  return (
    <DualSidebarProvider
      class={props.class}
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onActiveKeyChange={(key, path) => {
        const sectionPath = path ?? [{ key, title: sections.find(s => s.key === key)?.label ?? key }]
        onActiveKeyChange?.(key, sectionPath)
      }}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DualSidebar>
        <DualSidebarRail>
          <DualSidebarRailHeader>
            <Switch fallback={header as JSX.Element}>
              <Match when={isPresetHeader(header)}>
                <DualSidebarRailItem
                  tooltip={(header as AppSidebarHeaderProps).title}
                  openOnSelect={false}
                >
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {(header as AppSidebarHeaderProps).icon}
                  </div>
                </DualSidebarRailItem>
              </Match>
            </Switch>
          </DualSidebarRailHeader>

          <DualSidebarRailContent>
            <For each={sections}>
              {section => (
                <DualSidebarRailItem
                  sectionKey={section.key}
                  tooltip={section.tooltip ?? section.label}
                >
                  {section.icon}
                </DualSidebarRailItem>
              )}
            </For>
          </DualSidebarRailContent>

          <DualSidebarRailFooter>
            <Switch fallback={railFooter as JSX.Element}>
              <Match when={Array.isArray(railFooter)}>
                <For each={railFooter as DualAppSidebarRailFooterItem[]}>
                  {item => (
                    <DualSidebarRailItem
                      tooltip={item.tooltip}
                      sectionKey={item.sectionKey}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </DualSidebarRailItem>
                  )}
                </For>
              </Match>
            </Switch>
          </DualSidebarRailFooter>
        </DualSidebarRail>

        <DualSidebarPanel>
          <For each={sections}>
            {section => (
              <DualSidebarSection sectionKey={section.key}>
                <DualSidebarPanelHeader>
                  <Show
                    when={section.header}
                    fallback={<DualSidebarPanelTitle>{section.label}</DualSidebarPanelTitle>}
                  >
                    {section.header}
                  </Show>
                </DualSidebarPanelHeader>

                <DualSidebarPanelContent>
                  <SidebarProvider>
                    <For each={section.menus}>
                      {group => (
                        <SidebarGroup>
                          <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                          <SidebarGroupContent>
                            <SidebarMenuTree items={group.items} onActivePathChange={menuPath => onActiveKeyChange?.(section.key, [{ key: section.key, title: section.label }, ...menuPath])} />
                          </SidebarGroupContent>
                        </SidebarGroup>
                      )}
                    </For>
                  </SidebarProvider>
                </DualSidebarPanelContent>

                <Show when={section.footer}>
                  <DualSidebarPanelFooter>
                    <Switch fallback={section.footer as JSX.Element}>
                      <Match when={Array.isArray(section.footer)}>
                        <SidebarProvider>
                          <SidebarMenuTree
                            items={section.footer as SidebarMenuTreeProps['items']}
                            onActivePathChange={menuPath => onActiveKeyChange?.(section.key, [{ key: section.key, title: section.label }, ...menuPath])}
                          />
                        </SidebarProvider>
                      </Match>
                    </Switch>
                  </DualSidebarPanelFooter>
                </Show>
              </DualSidebarSection>
            )}
          </For>
        </DualSidebarPanel>

        <DualSidebarInset>
          <header class="flex h-12 items-center gap-2 border-b px-3">
            <DualSidebarTrigger />
          </header>
          {body}
        </DualSidebarInset>
      </DualSidebar>
    </DualSidebarProvider>
  )
}
