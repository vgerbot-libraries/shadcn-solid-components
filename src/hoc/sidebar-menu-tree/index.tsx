import { For, Show, type Accessor, type JSX } from "solid-js"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/sidebar"

export type SidebarMenuTreeItem = {
  collapsible?: boolean
  title: string
  url?: string
  onClick?: () => void
  icon?: Accessor<JSX.Element>
  isActive?: boolean
  items?: SidebarMenuTreeItem[]
}

export type SidebarMenuTreeProps = {
  items: SidebarMenuTreeItem[]
}

const renderSubItem = (subItem: SidebarMenuTreeItem) => {
  const hasSubItems = () => subItem.items && subItem.items.length > 0
  const isSubCollapsible = () => subItem.collapsible !== false && hasSubItems()

  const subButtonProps = () => {
    const props: any = {
      isActive: subItem.isActive,
    }

    if (subItem.url) {
      props.as = "a"
      props.href = subItem.url
    }

    if (subItem.onClick) {
      props.onClick = subItem.onClick
    }

    return props
  }

  if (isSubCollapsible()) {
    return (
      <Collapsible<typeof SidebarMenuSubItem>
        defaultOpen={subItem.isActive}
        as={(props) => (
          <SidebarMenuSubItem {...props}>
            <CollapsibleTrigger<typeof SidebarMenuSubButton>
              as={(props) => (
                <SidebarMenuSubButton
                  {...props}
                  {...subButtonProps()}
                  class="[&>svg:last-of-type]:aria-expanded:rotate-90"
                >
                  <Show when={subItem.icon}>{subItem.icon!()}</Show>
                  <span>{subItem.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="ml-auto transition-transform duration-200"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m9 18l6-6l-6-6"
                    />
                  </svg>
                </SidebarMenuSubButton>
              )}
            />
            <CollapsibleContent>
              <SidebarMenuSub>
                <For each={subItem.items}>
                  {(nestedItem) => renderSubItem(nestedItem)}
                </For>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        )}
      />
    )
  }

  if (hasSubItems()) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton {...subButtonProps()}>
          <Show when={subItem.icon}>{subItem.icon!()}</Show>
          <span>{subItem.title}</span>
        </SidebarMenuSubButton>
        <SidebarMenuSub>
          <For each={subItem.items}>
            {(nestedItem) => renderSubItem(nestedItem)}
          </For>
        </SidebarMenuSub>
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton {...subButtonProps()}>
        <Show when={subItem.icon}>{subItem.icon!()}</Show>
        <span>{subItem.title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

const SidebarMenuTreeItem = (item: SidebarMenuTreeItem) => {
  const hasItems = () => item.items && item.items.length > 0
  const isCollapsible = () => item.collapsible !== false && hasItems()

  const buttonProps = (excludeClickAndRef = false) => {
    const props: any = {
      tooltip: item.title,
      isActive: item.isActive,
    }

    if(!excludeClickAndRef) {
      if (item.url) {
        props.as = "a"
        props.href = item.url
      }

      if (item.onClick) {
        props.onClick = item.onClick
      }
    }

    return props
  }

  const renderSubItems = () => {
    if (!hasItems()) return null

    return (
      <SidebarMenuSub>
        <For each={item.items}>
          {(subItem) => renderSubItem(subItem)}
        </For>
      </SidebarMenuSub>
    )
  }

  if (isCollapsible()) {
    return (
      <Collapsible<typeof SidebarMenuItem>
        defaultOpen={item.isActive}
        as={(props) => (
          <SidebarMenuItem {...props}>
            <CollapsibleTrigger<typeof SidebarMenuButton>
              as={(props) => (
                <SidebarMenuButton
                  {...props}
                  {...buttonProps(true)}
                  class="[&>svg:last-of-type]:aria-expanded:rotate-90"
                >
                  <Show when={item.icon}>{item.icon!()}</Show>
                  <span>{item.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="ml-auto transition-transform duration-200"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m9 18l6-6l-6-6"
                    />
                  </svg>
                </SidebarMenuButton>
              )}
            />
            <CollapsibleContent>{renderSubItems()}</CollapsibleContent>
          </SidebarMenuItem>
        )}
      />
    )
  }

  if (hasItems()) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton {...buttonProps()}>
          <Show when={item.icon}>{item.icon!()}</Show>
          <span>{item.title}</span>
        </SidebarMenuButton>
        {renderSubItems()}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton {...buttonProps()}>
        <Show when={item.icon}>{item.icon!()}</Show>
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export const SidebarMenuTree = (props: SidebarMenuTreeProps) => {
  return (
    <SidebarMenu>
      <For each={props.items}>
        {(item) => <SidebarMenuTreeItem {...item} />}
      </For>
    </SidebarMenu>
  )
}
