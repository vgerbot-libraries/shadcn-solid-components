import {
  BreadcrumbList,
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsSeparator,
} from 'shadcn-solid-components/components/breadcrumbs'
import { Separator } from 'shadcn-solid-components/components/separator'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  /** Display label. */
  label: string
  /** If provided the item renders as a link; otherwise plain text. */
  href?: string
}

export interface PageHeaderProps extends ComponentProps<'div'> {
  /** Breadcrumb trail displayed above the title. */
  breadcrumbs?: BreadcrumbItem[]
  /** Page title (required). */
  title: string
  /** Optional description shown below the title. */
  description?: string | JSX.Element
  /** Action buttons rendered on the right side. */
  actions?: JSX.Element
  /** When `true` a bottom separator is rendered. Defaults to `false`. */
  separator?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * A consistent page header with optional breadcrumbs, title, description
 * and action buttons.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Users' }]}
 *   title="User Management"
 *   description="Manage all users in the system"
 *   actions={<Button>Add User</Button>}
 * />
 * ```
 */
export function PageHeader(props: PageHeaderProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'breadcrumbs',
    'title',
    'description',
    'actions',
    'separator',
  ])

  return (
    <div data-slot="page-header" class={cx('flex flex-col gap-4', local.class)} {...rest}>
      <Show when={local.breadcrumbs?.length}>
        <Breadcrumbs>
          <BreadcrumbList>
            <For each={local.breadcrumbs}>
              {(item, index) => (
                <>
                  <Show when={index() > 0}>
                    <BreadcrumbsSeparator />
                  </Show>
                  <BreadcrumbsItem>
                    <Show
                      when={item.href}
                      fallback={<span class="text-foreground font-medium">{item.label}</span>}
                    >
                      <BreadcrumbsLink href={item.href}>{item.label}</BreadcrumbsLink>
                    </Show>
                  </BreadcrumbsItem>
                </>
              )}
            </For>
          </BreadcrumbList>
        </Breadcrumbs>
      </Show>

      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold tracking-tight">{local.title}</h1>
          <Show when={local.description}>
            <p class="text-muted-foreground text-sm">{local.description}</p>
          </Show>
        </div>
        <Show when={local.actions}>
          <div class="flex shrink-0 items-center gap-2">{local.actions}</div>
        </Show>
      </div>

      <Show when={local.separator}>
        <Separator />
      </Show>
    </div>
  )
}
