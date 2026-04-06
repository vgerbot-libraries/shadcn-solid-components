import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-solid-components/components/card'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'

// ============================================================================
// Types
// ============================================================================

export type StatCardTrend = 'up' | 'down' | 'neutral'

export interface StatCardProps extends ComponentProps<'div'> {
  /** Metric label (e.g. "Total Revenue"). */
  label: string
  /** The main metric value (e.g. "$12,345" or a number). */
  value: string | number
  /** Optional trend direction — controls the arrow icon and colour. */
  trend?: StatCardTrend
  /** Trend description text (e.g. "+12.5% from last month"). */
  trendText?: string
  /** Icon rendered in the card header. */
  icon?: JSX.Element
  /** Optional footer content (e.g. a mini chart or sparkline). */
  footer?: JSX.Element
}

// ============================================================================
// Helpers
// ============================================================================

function TrendIcon(props: { trend: StatCardTrend }) {
  return (
    <Show when={props.trend !== 'neutral'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={cx(
          'size-4',
          props.trend === 'up' && 'text-emerald-500',
          props.trend === 'down' && 'text-red-500',
        )}
        viewBox="0 0 24 24"
      >
        <Show
          when={props.trend === 'up'}
          fallback={
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m7 7l5 5l5-5M7 13l5 5l5-5"
            />
          }
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 17l5-5l5 5M7 11l5-5l5 5"
          />
        </Show>
      </svg>
    </Show>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A dashboard statistics card showing a label, metric value, trend
 * indicator and optional footer (e.g. a sparkline chart).
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Revenue"
 *   value="$45,231.89"
 *   trend="up"
 *   trendText="+20.1% from last month"
 *   icon={<IconCreditCard class="size-4 text-muted-foreground" />}
 * />
 * ```
 */
export function StatCard(props: StatCardProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'label',
    'value',
    'trend',
    'trendText',
    'icon',
    'footer',
  ])

  return (
    <Card class={cx('gap-0 py-0', local.class)} {...rest}>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 px-6 pt-4 pb-2">
        <CardTitle class="text-muted-foreground text-sm font-medium">{local.label}</CardTitle>
        <Show when={local.icon}>
          <div class="text-muted-foreground">{local.icon}</div>
        </Show>
      </CardHeader>
      <CardContent class="px-6 pb-4">
        <div class="text-2xl font-bold">{local.value}</div>
        <Show when={local.trend || local.trendText}>
          <div class="mt-1 flex items-center gap-1 text-xs">
            <Show when={local.trend}>
              <TrendIcon trend={local.trend!} />
            </Show>
            <Show when={local.trendText}>
              <span class="text-muted-foreground">{local.trendText}</span>
            </Show>
          </div>
        </Show>
      </CardContent>
      <Show when={local.footer}>
        <div class="border-t px-6 py-3">{local.footer}</div>
      </Show>
    </Card>
  )
}
