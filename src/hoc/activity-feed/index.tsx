import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import type { ActivityFeedLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, createMemo, For, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface ActivityUser {
  /** User display name. */
  name: string
  /** Optional avatar URL. */
  avatar?: string
  /** Initials shown in avatar fallback (e.g., "AG"). */
  initials?: string
}

export interface ActivityItem {
  /** Unique item identifier. */
  id: string
  /** User who performed the action. */
  user: ActivityUser
  /** Action description text (e.g., "commented on your"). */
  action: string | JSX.Element
  /** Optional action target (e.g., "Post", "PD-979"). */
  target?: string
  /** Timestamp display text (e.g., "06:20 PM"). */
  timestamp: string
  /** Date group label (e.g., "SUNDAY, 06 MARCH"). */
  group?: string
  /** Optional icon rendered instead of avatar. */
  icon?: JSX.Element
  /** Optional extra content (comment text, tags, etc.). */
  meta?: JSX.Element
}

export interface ActivityFeedProps extends ComponentProps<'div'> {
  /** Array of activity items to display. */
  items: ActivityItem[]
  /** Grouping mode. `'date'` shows date headers; `'none'` shows flat list. */
  groupBy?: 'date' | 'none'
  /** Empty state message or element. */
  empty?: string | JSX.Element
  /** Loading state. */
  loading?: boolean
  /** Callback for "Load more" button. When provided, button is shown. */
  onLoadMore?: () => void
  /** Loading state for "Load more" button. */
  loadingMore?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * An activity feed timeline with optional date grouping and infinite scroll.
 * Items are displayed with avatar or icon, action description, and optional metadata.
 *
 * @example
 * ```tsx
 * const items: ActivityItem[] = [
 *   {
 *     id: '1',
 *     user: { name: 'Alice', initials: 'A' },
 *     action: 'commented on',
 *     target: 'Pull Request #123',
 *     timestamp: '2 hours ago',
 *     group: 'Today',
 *     meta: <p class="bg-muted p-2 rounded text-sm">Great work!</p>
 *   }
 * ]
 *
 * <ActivityFeed items={items} groupBy="date" onLoadMore={loadMore} />
 * ```
 */
export function ActivityFeed(props: ActivityFeedProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'items',
    'groupBy',
    'empty',
    'loading',
    'onLoadMore',
    'loadingMore',
  ])

  const locale = (): ActivityFeedLocale => ({
    ...defaultLocale,
    ...useLocale().ActivityFeed,
  })

  // Group items by date if groupBy is 'date'
  const groupedItems = createMemo(() => {
    if (local.groupBy !== 'date') {
      return [{ group: null, items: local.items }]
    }

    const groups: Array<{ group: string | null; items: ActivityItem[] }> = []
    let currentGroup: string | null = null
    let currentItems: ActivityItem[] = []

    for (const item of local.items) {
      if (item.group !== currentGroup) {
        if (currentItems.length > 0) {
          groups.push({ group: currentGroup, items: currentItems })
        }
        currentGroup = item.group ?? null
        currentItems = [item]
      } else {
        currentItems.push(item)
      }
    }

    if (currentItems.length > 0) {
      groups.push({ group: currentGroup, items: currentItems })
    }

    return groups
  })

  return (
    <div data-slot="activity-feed" class={cx('space-y-4', local.class)} {...rest}>
      <Show
        when={!local.loading && local.items.length > 0}
        fallback={
          <Show
            when={local.loading}
            fallback={
              <div class="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-center text-sm">
                {typeof local.empty === 'string' ? <p>{local.empty}</p> : local.empty || <p>{locale().empty}</p>}
              </div>
            }
          >
            <div class="flex items-center justify-center py-12">
              <div class="text-muted-foreground text-sm">{locale().loading}</div>
            </div>
          </Show>
        }
      >
        <For each={groupedItems()}>
          {group => (
            <div>
              {/* Date group header */}
              <Show when={group.group}>
                <div class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide md:mb-4 md:text-sm">
                  {group.group}
                </div>
              </Show>

              {/* Activity items */}
              <div class="space-y-4 md:space-y-6">
                <For each={group.items}>
                  {(item, index) => (
                    <div class="relative flex gap-2 md:gap-3">
                      {/* Timeline line (not shown for last item in group) */}
                      <Show when={index() < group.items.length - 1}>
                        <div class="bg-border absolute top-10 bottom-0 left-3 w-px md:top-12 md:left-4" />
                      </Show>

                      {/* Avatar or Icon */}
                      <div class="relative z-10">
                        <Show
                          when={!item.icon}
                          fallback={
                            <div class="bg-muted flex h-6 w-6 items-center justify-center rounded-full md:h-8 md:w-8">
                              {item.icon}
                            </div>
                          }
                        >
                          <Show
                            when={item.user.avatar}
                            fallback={
                              <span class="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
                                {item.user.initials || item.user.name.substring(0, 2).toUpperCase()}
                              </span>
                            }
                          >
                            <img
                              src={item.user.avatar}
                              alt={item.user.name}
                              class="h-6 w-6 rounded-full object-cover md:h-8 md:w-8"
                            />
                          </Show>
                        </Show>
                      </div>

                      {/* Content */}
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 md:text-sm">
                          <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                            <span class="text-foreground font-medium">{item.user.name}</span>
                            <span class="text-muted-foreground">{item.action}</span>
                            <Show when={item.target}>
                              <span class="text-foreground font-medium">{item.target}</span>
                            </Show>
                          </div>
                          <span class="text-muted-foreground text-xs sm:ml-auto md:text-sm">
                            {item.timestamp}
                          </span>
                        </div>

                        {/* Meta content (comments, tags, etc.) */}
                        <Show when={item.meta}>
                          <div class="mt-2 md:mt-3">{item.meta}</div>
                        </Show>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </Show>

      {/* Load more button */}
      <Show when={local.onLoadMore}>
        <div class="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={local.onLoadMore}
            disabled={local.loadingMore}
          >
            {local.loadingMore ? locale().loadingMore : locale().loadMore}
          </Button>
        </div>
      </Show>
    </div>
  )
}
