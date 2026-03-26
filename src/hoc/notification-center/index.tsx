import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { useLocale } from '@/components/config-provider'
import { IconBell } from '@/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { Separator } from '@/components/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import type { NotificationCenterLocale } from '@/i18n/types'
import { cx } from '@/lib/cva'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface NotificationItem {
  /** Unique identifier. */
  id: string
  /** Notification title. */
  title: string
  /** Notification description / body. */
  description?: string | JSX.Element
  /** Timestamp string (e.g. "5 min ago"). */
  time?: string
  /** Icon element. */
  icon?: JSX.Element
  /** Whether this notification has been read. */
  read?: boolean
  /** Category key for tab grouping. */
  category?: string
  /** Action button rendered in the notification row. */
  action?: JSX.Element
}

export interface NotificationCategory {
  /** Category key matching `NotificationItem.category`. */
  key: string
  /** Display label for the tab. */
  label: string
}

export interface NotificationCenterProps extends ComponentProps<'div'> {
  /** All notifications to display. */
  notifications: NotificationItem[]
  /** Optional categories for tab grouping. When provided, tabs are shown. */
  categories?: NotificationCategory[]
  /** Called when a notification is clicked / marked read. */
  onRead?: (id: string) => void
  /** Called when "Mark all read" is clicked. */
  onReadAll?: () => void
  /** Custom trigger element. Defaults to a bell icon with badge. */
  trigger?: JSX.Element
  /** Locale overrides. */
  locale?: Partial<NotificationCenterLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function NotificationRow(props: { item: NotificationItem; onRead?: (id: string) => void }) {
  return (
    <button
      type="button"
      class={cx(
        'flex w-full cursor-pointer items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent',
        !props.item.read && 'bg-accent/50',
      )}
      onClick={() => props.onRead?.(props.item.id)}
    >
      <Show when={props.item.icon}>
        <div class="text-muted-foreground mt-0.5 shrink-0">{props.item.icon}</div>
      </Show>

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <div class="flex items-start justify-between gap-2">
          <span class={cx('text-sm', !props.item.read && 'font-semibold')}>{props.item.title}</span>
          <Show when={!props.item.read}>
            <div class="bg-primary mt-1.5 size-2 shrink-0 rounded-full" />
          </Show>
        </div>
        <Show when={props.item.description}>
          <div class="text-muted-foreground line-clamp-2 text-xs">{props.item.description}</div>
        </Show>
        <Show when={props.item.time}>
          <span class="text-muted-foreground text-xs">{props.item.time}</span>
        </Show>
      </div>

      <Show when={props.item.action}>
        <div class="shrink-0" onClick={e => e.stopPropagation()}>
          {props.item.action}
        </div>
      </Show>
    </button>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A notification dropdown panel with bell icon trigger, categorized tabs,
 * read/unread state and "mark all read" action.
 *
 * @example
 * ```tsx
 * <NotificationCenter
 *   notifications={notifications()}
 *   categories={[
 *     { key: 'messages', label: 'Messages' },
 *     { key: 'updates', label: 'Updates' },
 *   ]}
 *   onRead={id => markAsRead(id)}
 *   onReadAll={() => markAllRead()}
 * />
 * ```
 */
export function NotificationCenter(props: NotificationCenterProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'notifications',
    'categories',
    'onRead',
    'onReadAll',
    'trigger',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): NotificationCenterLocale => ({
    ...defaultLocale,
    ...globalLocale.NotificationCenter,
    ...local.locale,
  })
  const unreadCount = () => local.notifications.filter(n => !n.read).length
  const hasCategories = () => local.categories && local.categories.length > 0

  const filterByCategory = (category?: string) => {
    if (!category) return local.notifications
    return local.notifications.filter(n => n.category === category)
  }

  const defaultTrigger = () => (
    <Button variant="ghost" size="icon" class="relative">
      <IconBell class="size-5" />
      <Show when={unreadCount() > 0}>
        <Badge
          class="absolute -top-1 -right-1 flex size-5 items-center justify-center p-0 text-[10px]"
          variant="destructive"
        >
          {unreadCount() > 99 ? '99+' : unreadCount()}
        </Badge>
      </Show>
      <span class="sr-only">{locale().title}</span>
    </Button>
  )

  const renderList = (items: NotificationItem[]) => (
    <Show
      when={items.length > 0}
      fallback={
        <div class="text-muted-foreground flex items-center justify-center py-8 text-sm">
          {locale().empty}
        </div>
      }
    >
      <div class="flex flex-col">
        <For each={items}>{item => <NotificationRow item={item} onRead={local.onRead} />}</For>
      </div>
    </Show>
  )

  return (
    <div data-slot="notification-center" class={local.class} {...rest}>
      <Popover>
        <PopoverTrigger>{local.trigger ?? defaultTrigger()}</PopoverTrigger>

        <PopoverContent class="w-[380px] p-0">
          {/* Header */}
          <div class="flex items-center justify-between px-4 py-3">
            <h4 class="text-sm font-semibold">{locale().title}</h4>
            <Show when={unreadCount() > 0}>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground h-auto p-0 text-xs hover:text-foreground"
                onClick={() => local.onReadAll?.()}
              >
                {locale().markAllRead}
              </Button>
            </Show>
          </div>

          <Separator />

          {/* Content */}
          <div class="max-h-[400px] overflow-y-auto">
            <Show when={hasCategories()} fallback={renderList(local.notifications)}>
              <Tabs defaultValue="__all__">
                <div class="px-2 pt-2">
                  <TabsList class="w-full">
                    <TabsTrigger value="__all__">{locale().all}</TabsTrigger>
                    <For each={local.categories}>
                      {cat => <TabsTrigger value={cat.key}>{cat.label}</TabsTrigger>}
                    </For>
                  </TabsList>
                </div>

                <TabsContent value="__all__" class="mt-0">
                  {renderList(local.notifications)}
                </TabsContent>
                <For each={local.categories}>
                  {cat => (
                    <TabsContent value={cat.key} class="mt-0">
                      {renderList(filterByCategory(cat.key))}
                    </TabsContent>
                  )}
                </For>
              </Tabs>
            </Show>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
