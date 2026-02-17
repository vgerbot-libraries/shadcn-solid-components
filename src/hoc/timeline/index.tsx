import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { cx } from '@/lib/cva'

// ============================================================================
// Locale
// ============================================================================

export interface TimelineLocale {
  pending: string
}

export const enLocale: TimelineLocale = {
  pending: 'Loading...',
}

export const zhCNLocale: TimelineLocale = {
  pending: '加载中…',
}

export const zhTWLocale: TimelineLocale = {
  pending: '載入中…',
}

export const jaLocale: TimelineLocale = {
  pending: '読み込み中…',
}

// ============================================================================
// Types
// ============================================================================

export interface TimelineItem {
  /** Primary title / heading for this event. */
  title: string
  /** Optional description text. */
  description?: string | JSX.Element
  /** Timestamp or date string displayed beside the event. */
  time?: string
  /** Custom icon for the timeline node. Defaults to a dot. */
  icon?: JSX.Element
  /** Colour of the timeline node (Tailwind text colour class, e.g. `'text-blue-500'`). */
  color?: string
  /** Additional content rendered below title/description. */
  content?: JSX.Element
}

export type TimelineMode = 'left' | 'right' | 'alternate'

export interface TimelineProps extends ComponentProps<'div'> {
  /** The events to display on the timeline. */
  items: TimelineItem[]
  /**
   * Layout mode.
   * - `'left'` — all events on the left (default)
   * - `'right'` — all events on the right
   * - `'alternate'` — events alternate left and right
   */
  mode?: TimelineMode
  /** When `true` a loading indicator is appended at the end. */
  pending?: boolean
  /** Locale overrides. */
  locale?: Partial<TimelineLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function TimelineNode(props: { icon?: JSX.Element; color?: string }) {
  return (
    <div
      class={cx(
        'relative z-10 flex shrink-0 items-center justify-center rounded-full',
        props.icon ? 'size-8 bg-background border' : 'size-3 border-2',
        props.color ?? (props.icon ? 'text-foreground' : 'border-primary bg-primary'),
      )}
    >
      <Show when={props.icon}>{props.icon}</Show>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A vertical timeline for activity feeds, changelogs, or order tracking.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { title: 'Order placed', time: '2024-01-15', description: 'Your order has been received.' },
 *     { title: 'Processing', time: '2024-01-16', icon: <IconLoader class="size-4" /> },
 *     { title: 'Shipped', time: '2024-01-17', color: 'text-green-500' },
 *   ]}
 * />
 * ```
 */
export function Timeline(props: TimelineProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'items',
    'mode',
    'pending',
    'locale',
  ])

  const locale = (): TimelineLocale => ({ ...enLocale, ...local.locale })
  const mode = () => local.mode ?? 'left'

  const isRight = (index: number) => {
    if (mode() === 'right') return true
    if (mode() === 'alternate') return index % 2 === 1
    return false
  }

  return (
    <div
      data-slot="timeline"
      class={cx('relative w-full', local.class)}
      {...rest}
    >
      <For each={local.items}>
        {(item, index) => {
          const right = () => isRight(index())
          const isLast = () => index() === local.items.length - 1

          return (
            <div
              class={cx(
                'group relative flex gap-4',
                mode() === 'alternate' && 'md:gap-0',
                mode() === 'alternate' && right() && 'md:flex-row-reverse',
              )}
            >
              {/* Vertical line */}
              <Show when={!isLast() || local.pending}>
                <div
                  class={cx(
                    'absolute top-0 bottom-0 w-px bg-border',
                    mode() === 'alternate'
                      ? 'left-[calc(50%-0.5px)] hidden md:block'
                      : item.icon ? 'left-4' : 'left-1.5',
                  )}
                />
              </Show>

              {/* Left-side line for non-alternate mode */}
              <Show when={mode() !== 'alternate'}>
                <div class="relative flex flex-col items-center">
                  <TimelineNode icon={item.icon} color={item.color} />
                </div>
              </Show>

              {/* Alternate: left content or spacer */}
              <Show when={mode() === 'alternate'}>
                <div class="hidden flex-1 md:block">
                  <Show when={!right()}>
                    <div class="pr-8 text-right">
                      <TimelineContent item={item} align="right" />
                    </div>
                  </Show>
                </div>

                {/* Center node */}
                <div class="relative z-10 hidden flex-col items-center md:flex">
                  <TimelineNode icon={item.icon} color={item.color} />
                </div>

                <div class="hidden flex-1 md:block">
                  <Show when={right()}>
                    <div class="pl-8">
                      <TimelineContent item={item} align="left" />
                    </div>
                  </Show>
                </div>

                {/* Mobile fallback: always left-aligned */}
                <div class="relative flex items-start gap-4 md:hidden">
                  <div class="flex flex-col items-center">
                    <TimelineNode icon={item.icon} color={item.color} />
                  </div>
                  <TimelineContent item={item} align="left" />
                </div>
              </Show>

              {/* Non-alternate content */}
              <Show when={mode() !== 'alternate'}>
                <div class={cx('flex-1 pb-8', mode() === 'right' && 'text-right')}>
                  <TimelineContent item={item} align={mode() === 'right' ? 'right' : 'left'} />
                </div>
              </Show>
            </div>
          )
        }}
      </For>

      {/* Pending indicator */}
      <Show when={local.pending}>
        <div
          class={cx(
            'relative flex gap-4',
            mode() === 'alternate' && 'justify-center',
          )}
        >
          <div class="relative flex flex-col items-center">
            <div class="size-3 animate-pulse rounded-full bg-muted-foreground" />
          </div>
          <Show when={mode() !== 'alternate'}>
            <span class="text-muted-foreground text-sm">{locale().pending}</span>
          </Show>
        </div>
      </Show>
    </div>
  )
}

function TimelineContent(props: { item: TimelineItem; align: 'left' | 'right' }) {
  return (
    <div class={cx('pb-8', props.align === 'right' && 'text-right')}>
      <div class="flex flex-col gap-1">
        <div
          class={cx(
            'flex items-center gap-2',
            props.align === 'right' && 'justify-end',
          )}
        >
          <span class="text-sm font-semibold">{props.item.title}</span>
          <Show when={props.item.time}>
            <span class="text-muted-foreground text-xs">{props.item.time}</span>
          </Show>
        </div>
        <Show when={props.item.description}>
          <div class="text-muted-foreground text-sm">{props.item.description}</div>
        </Show>
      </div>
      <Show when={props.item.content}>
        <div class="mt-2">{props.item.content}</div>
      </Show>
    </div>
  )
}
