import { type Accessor, createMemo, For, type JSX, Show } from 'solid-js'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/sidebar'
import { cx } from '@/lib/cva'
import { parseUrl, type UrlInfo, type UrlInfoInput, useCurrentUrl } from '@/lib/use-current-url'

export type UrlMatchStrategy = 'exact' | 'startsWith' | 'endsWith' | RegExp

export type SearchParamMatchValue =
  | string // Exact value match against currentUrl
  | RegExp // Regex test against currentUrl
  | true // Check if parameter exists in currentUrl
  | { matchItemValue: true } // Match against item.url parameter value

export type UrlMatchConfig = {
  pathname?: UrlMatchStrategy
  hash?: UrlMatchStrategy
  searchParams?: Record<string, SearchParamMatchValue>
}

export type SidebarMenuTreeItem = {
  collapsible?: boolean
  title: string
  url?: string
  onClick?: () => void
  icon?: Accessor<JSX.Element>
  isActive?: boolean
  items?: SidebarMenuTreeItem[]
  disabled?: boolean
  visible?: boolean
  class?: string
  // Supports simple string matching (backward compatible), detailed config object, or custom callback
  urlMatch?:
    | UrlMatchStrategy
    | UrlMatchConfig
    | ((currentUrl: UrlInfo, itemUrl: UrlInfo) => boolean)
  loading?: boolean
  open?: boolean
  defaultOpen?: boolean
}

export type SidebarMenuTreeProps = {
  items: SidebarMenuTreeItem[]
  currentUrl?: UrlInfoInput
}

const matchString = (value: string, pattern: string, strategy: UrlMatchStrategy): boolean => {
  if (strategy === 'exact') {
    return value === pattern
  } else if (strategy === 'startsWith') {
    return value.startsWith(pattern)
  } else if (strategy === 'endsWith') {
    return value.endsWith(pattern)
  } else if (strategy instanceof RegExp) {
    return strategy.test(value)
  }
  return false
}

const matchUrl = (
  itemUrl: string | undefined,
  currentUrl: UrlInfo,
  matchConfig?:
    | UrlMatchStrategy
    | UrlMatchConfig
    | ((currentUrl: UrlInfo, itemUrl: UrlInfo) => boolean),
): boolean => {
  if (!itemUrl) return false

  const itemUrlInfo = parseUrl(itemUrl)

  // Default to pathname exact match for backward compatibility
  if (!matchConfig) {
    return itemUrlInfo.pathname === currentUrl.pathname
  }

  // Custom callback function
  if (typeof matchConfig === 'function') {
    return matchConfig(currentUrl, itemUrlInfo)
  }

  // Simple string matching strategy (backward compatible) - only match pathname
  if (typeof matchConfig === 'string' || matchConfig instanceof RegExp) {
    return matchString(currentUrl.pathname, itemUrlInfo.pathname, matchConfig)
  }

  // Detailed config object
  const config = matchConfig as UrlMatchConfig
  let matches = true

  if (config.pathname !== undefined) {
    matches = matches && matchString(currentUrl.pathname, itemUrlInfo.pathname, config.pathname)
  }

  if (config.hash !== undefined) {
    matches = matches && matchString(currentUrl.hash, itemUrlInfo.hash, config.hash)
  }

  if (config.searchParams !== undefined) {
    for (const [key, value] of Object.entries(config.searchParams)) {
      const currentValue = currentUrl.searchParams.get(key)
      const itemValue = itemUrlInfo.searchParams.get(key)

      if (value === true) {
        // Check if parameter exists in currentUrl
        matches = matches && currentValue !== null
      } else if (typeof value === 'object' && 'matchItemValue' in value) {
        // Match currentUrl parameter value against item.url parameter value
        matches = matches && currentValue !== null && currentValue === itemValue
      } else if (typeof value === 'string') {
        // Exact string value match against currentUrl
        matches = matches && currentValue === value
      } else if (value instanceof RegExp) {
        // Regex match against currentUrl
        matches = matches && currentValue !== null && value.test(currentValue)
      }
    }
  }

  return matches
}

// Recursively check if menu item and its children match URL (memoized)
const createItemMatcher = (
  item: SidebarMenuTreeItem,
  currentUrl: Accessor<UrlInfo>,
): Accessor<boolean> => {
  return createMemo(() => {
    const url = currentUrl()

    // Check if current item matches URL
    const urlMatches = item.url && matchUrl(item.url, url, item.urlMatch)

    // Recursively check if children match
    const childMatches =
      item.items && item.items.length > 0
        ? item.items.some(subItem => checkItemMatch(subItem, url))
        : false

    // Activate if URL matches or child matches
    if (urlMatches || childMatches) {
      return true
    }

    // Use explicit isActive if set
    if (item.isActive !== undefined) {
      return item.isActive
    }

    return false
  })
}

// Non-memoized version for recursive checks
const checkItemMatch = (item: SidebarMenuTreeItem, currentUrl: UrlInfo): boolean => {
  // Check if current item matches URL
  const urlMatches = item.url && matchUrl(item.url, currentUrl, item.urlMatch)

  // Recursively check if children match
  const childMatches =
    item.items && item.items.length > 0
      ? item.items.some(subItem => checkItemMatch(subItem, currentUrl))
      : false

  // Activate if URL matches or child matches
  if (urlMatches || childMatches) {
    return true
  }

  // Use explicit isActive if set
  if (item.isActive !== undefined) {
    return item.isActive
  }

  return false
}

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4 animate-spin" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"
    />
  </svg>
)

const renderSubItem = (subItem: SidebarMenuTreeItem, currentUrl: Accessor<UrlInfo>) => {
  const isVisible = subItem.visible !== false

  // URL matching automatically activates (reactive with memoization)
  const isActive = createItemMatcher(subItem, currentUrl)

  const hasSubItems = () => subItem.items && subItem.items.length > 0
  const isSubCollapsible = () => subItem.collapsible !== false && hasSubItems()

  // Open state: prioritize controlled 'open', then 'defaultOpen', finally 'isActive'
  const getOpenState = () => {
    if (subItem.open !== undefined) {
      return { open: subItem.open }
    }
    if (subItem.defaultOpen !== undefined) {
      return { defaultOpen: subItem.defaultOpen }
    }
    return { defaultOpen: isActive() }
  }

  const subButtonProps = () => {
    const props: any = {
      isActive: isActive(),
      disabled: subItem.disabled || subItem.loading,
      'aria-disabled': subItem.disabled || subItem.loading,
    }

    if (subItem.url && !subItem.disabled && !subItem.loading) {
      props.as = 'a'
      props.href = subItem.url
    }

    if (subItem.onClick && !subItem.disabled && !subItem.loading) {
      props.onClick = subItem.onClick
    }

    return props
  }

  if (!isVisible) {
    return null
  }

  if (isSubCollapsible()) {
    return (
      <Collapsible<typeof SidebarMenuSubItem>
        {...getOpenState()}
        as={props => (
          <SidebarMenuSubItem {...props} class={cx(subItem.class, props.class)}>
            <CollapsibleTrigger<typeof SidebarMenuSubButton>
              as={props => (
                <SidebarMenuSubButton
                  {...props}
                  {...subButtonProps()}
                  class={cx(
                    '[&>svg:last-of-type]:aria-expanded:rotate-90',
                    subItem.class,
                    props.class,
                  )}
                >
                  <Show when={subItem.loading}>
                    <LoadingIcon />
                  </Show>
                  <Show when={!subItem.loading && subItem.icon}>{subItem.icon!()}</Show>
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
                  {nestedItem => renderSubItem(nestedItem, currentUrl)}
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
      <SidebarMenuSubItem class={subItem.class}>
        <SidebarMenuSubButton {...subButtonProps()}>
          <Show when={subItem.loading}>
            <LoadingIcon />
          </Show>
          <Show when={!subItem.loading && subItem.icon}>{subItem.icon!()}</Show>
          <span>{subItem.title}</span>
        </SidebarMenuSubButton>
        <SidebarMenuSub>
          <For each={subItem.items}>{nestedItem => renderSubItem(nestedItem, currentUrl)}</For>
        </SidebarMenuSub>
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuSubItem class={subItem.class}>
      <SidebarMenuSubButton {...subButtonProps()}>
        <Show when={subItem.loading}>
          <LoadingIcon />
        </Show>
        <Show when={!subItem.loading && subItem.icon}>{subItem.icon!()}</Show>
        <span>{subItem.title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

const SidebarMenuTreeItem = (props: {
  item: SidebarMenuTreeItem
  currentUrl: Accessor<UrlInfo>
}) => {
  const { item, currentUrl } = props

  const isVisible = item.visible !== false

  // URL matching automatically activates (reactive with memoization)
  const isActive = createItemMatcher(item, currentUrl)

  const hasItems = () => item.items && item.items.length > 0
  const isCollapsible = () => item.collapsible !== false && hasItems()

  // Open state: prioritize controlled 'open', then 'defaultOpen', finally 'isActive'
  const getOpenState = () => {
    if (item.open !== undefined) {
      return { open: item.open }
    }
    if (item.defaultOpen !== undefined) {
      return { defaultOpen: item.defaultOpen }
    }
    return { defaultOpen: isActive() }
  }

  const buttonProps = (excludeClickAndRef = false) => {
    const props: any = {
      tooltip: item.title,
      isActive: isActive(),
      disabled: item.disabled || item.loading,
      'aria-disabled': item.disabled || item.loading,
    }

    if (!excludeClickAndRef) {
      if (item.url && !item.disabled && !item.loading) {
        props.as = 'a'
        props.href = item.url
      }

      if (item.onClick && !item.disabled && !item.loading) {
        props.onClick = item.onClick
      }
    }

    return props
  }

  const renderSubItems = () => {
    if (!hasItems()) return null

    return (
      <SidebarMenuSub>
        <For each={item.items}>{subItem => renderSubItem(subItem, currentUrl)}</For>
      </SidebarMenuSub>
    )
  }

  if (!isVisible) {
    return null
  }

  if (isCollapsible()) {
    return (
      <Collapsible<typeof SidebarMenuItem>
        {...getOpenState()}
        as={props => (
          <SidebarMenuItem {...props} class={cx(item.class, props.class)}>
            <CollapsibleTrigger<typeof SidebarMenuButton>
              as={props => (
                <SidebarMenuButton
                  {...props}
                  {...buttonProps(true)}
                  class={cx(
                    '[&>svg:last-of-type]:aria-expanded:rotate-90',
                    item.class,
                    props.class,
                  )}
                >
                  <Show when={item.loading}>
                    <LoadingIcon />
                  </Show>
                  <Show when={!item.loading && item.icon}>{item.icon!()}</Show>
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
      <SidebarMenuItem class={item.class}>
        <SidebarMenuButton {...buttonProps()}>
          <Show when={item.loading}>
            <LoadingIcon />
          </Show>
          <Show when={!item.loading && item.icon}>{item.icon!()}</Show>
          <span>{item.title}</span>
        </SidebarMenuButton>
        {renderSubItems()}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem class={item.class}>
      <SidebarMenuButton {...buttonProps()}>
        <Show when={item.loading}>
          <LoadingIcon />
        </Show>
        <Show when={!item.loading && item.icon}>{item.icon!()}</Show>
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export const SidebarMenuTree = (props: SidebarMenuTreeProps) => {
  const currentUrl = useCurrentUrl(props.currentUrl)

  return (
    <SidebarMenu>
      <For each={props.items}>
        {item => <SidebarMenuTreeItem item={item} currentUrl={currentUrl} />}
      </For>
    </SidebarMenu>
  )
}
