import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-solid-components/components/card'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { Separator } from 'shadcn-solid-components/components/separator'
import type { DescriptionListLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface DescriptionItem {
  /** The label / key name. */
  label: string
  /** The value to display. Can be a string, number, or custom JSX. */
  value?: string | number | JSX.Element
  /**
   * Number of columns this item spans in the grid (1-4).
   * Defaults to `1`.
   */
  span?: number
  /** When `true`, a copy button is shown next to the value. */
  copyable?: boolean
  /** Custom render function for the value. */
  render?: () => JSX.Element
}

export type DescriptionListLayout = 'horizontal' | 'vertical'

export interface DescriptionListProps extends ComponentProps<'div'> {
  /** Descriptive items to display. */
  items: DescriptionItem[]
  /** Number of columns in the grid (1-4). Defaults to `2`. */
  columns?: 1 | 2 | 3 | 4
  /** Whether to show a border around each item. Defaults to `false`. */
  bordered?: boolean
  /** Layout direction for label/value pairs. Defaults to `'vertical'`. */
  layout?: DescriptionListLayout
  /** Optional title rendered above the list. */
  title?: string
  /** Action elements rendered in the header row. */
  actions?: JSX.Element
  /** Wrap the list in a Card component. Defaults to `false`. */
  card?: boolean
  /** Locale overrides. */
  locale?: Partial<DescriptionListLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function CopyButton(props: { value: string; locale: DescriptionListLocale }) {
  let timeout: ReturnType<typeof setTimeout>

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.value)
    const el = document.activeElement as HTMLButtonElement | null
    if (el) {
      el.textContent = props.locale.copied
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        el.textContent = props.locale.copy
      }, 2000)
    }
  }

  return (
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground ml-1 inline-flex cursor-pointer text-xs underline-offset-4 hover:underline"
      onClick={handleCopy}
    >
      {props.locale.copy}
    </button>
  )
}

function columnClass(columns: number): string {
  switch (columns) {
    case 1:
      return 'grid-cols-1'
    case 3:
      return 'grid-cols-1 sm:grid-cols-3'
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1 sm:grid-cols-2'
  }
}

function spanClass(span: number): string {
  switch (span) {
    case 2:
      return 'sm:col-span-2'
    case 3:
      return 'sm:col-span-3'
    case 4:
      return 'sm:col-span-4'
    default:
      return ''
  }
}

// ============================================================================
// Component
// ============================================================================

/**
 * A structured key-value display for detail pages such as user profiles,
 * order details, or settings summaries.
 *
 * @example
 * ```tsx
 * <DescriptionList
 *   title="User Profile"
 *   columns={2}
 *   items={[
 *     { label: 'Name', value: 'John Doe' },
 *     { label: 'Email', value: 'john@example.com', copyable: true },
 *     { label: 'Bio', value: 'Software engineer', span: 2 },
 *   ]}
 * />
 * ```
 */
export function DescriptionList(props: DescriptionListProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'items',
    'columns',
    'bordered',
    'layout',
    'title',
    'actions',
    'card',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): DescriptionListLocale => ({
    ...defaultLocale,
    ...globalLocale.DescriptionList,
    ...local.locale,
  })
  const columns = () => local.columns ?? 2
  const layout = () => local.layout ?? 'vertical'

  const content = () => (
    <>
      <Show when={local.title || local.actions}>
        <div class="flex items-center justify-between">
          <Show when={local.title}>
            <h3 class="text-lg font-semibold">{local.title}</h3>
          </Show>
          <Show when={local.actions}>
            <div class="flex items-center gap-2">{local.actions}</div>
          </Show>
        </div>
        <Separator class="my-3" />
      </Show>

      <dl class={cx('grid gap-4', columnClass(columns()))}>
        <For each={local.items}>
          {item => {
            const valueText = () => {
              if (item.render) return item.render()
              if (item.value !== undefined && item.value !== null) return item.value
              return <span class="text-muted-foreground">—</span>
            }

            return (
              <div
                class={cx(
                  spanClass(item.span ?? 1),
                  local.bordered && 'rounded-md border p-3',
                  layout() === 'horizontal' && 'flex items-baseline justify-between gap-4',
                  layout() === 'vertical' && 'flex flex-col gap-1',
                )}
              >
                <dt class="text-muted-foreground text-sm font-medium">{item.label}</dt>
                <dd class="text-sm">
                  <span>{valueText()}</span>
                  <Show when={item.copyable && typeof item.value === 'string'}>
                    <CopyButton value={item.value as string} locale={locale()} />
                  </Show>
                </dd>
              </div>
            )
          }}
        </For>
      </dl>
    </>
  )

  return (
    <Show
      when={local.card}
      fallback={
        <div data-slot="description-list" class={cx('w-full', local.class)} {...rest}>
          {content()}
        </div>
      }
    >
      <Card data-slot="description-list" class={cx(local.class)} {...rest}>
        <Show when={local.title} fallback={<CardContent class="pt-6">{content()}</CardContent>}>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>{local.title}</CardTitle>
              <Show when={local.actions}>
                <div class="flex items-center gap-2">{local.actions}</div>
              </Show>
            </div>
          </CardHeader>
          <CardContent>
            <dl class={cx('grid gap-4', columnClass(columns()))}>
              <For each={local.items}>
                {item => {
                  const valueText = () => {
                    if (item.render) return item.render()
                    if (item.value !== undefined && item.value !== null) return item.value
                    return <span class="text-muted-foreground">—</span>
                  }

                  return (
                    <div
                      class={cx(
                        spanClass(item.span ?? 1),
                        local.bordered && 'rounded-md border p-3',
                        layout() === 'horizontal' && 'flex items-baseline justify-between gap-4',
                        layout() === 'vertical' && 'flex flex-col gap-1',
                      )}
                    >
                      <dt class="text-muted-foreground text-sm font-medium">{item.label}</dt>
                      <dd class="text-sm">
                        <span>{valueText()}</span>
                        <Show when={item.copyable && typeof item.value === 'string'}>
                          <CopyButton value={item.value as string} locale={locale()} />
                        </Show>
                      </dd>
                    </div>
                  )
                }}
              </For>
            </dl>
          </CardContent>
        </Show>
      </Card>
    </Show>
  )
}
