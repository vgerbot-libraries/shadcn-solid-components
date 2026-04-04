import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import { cx } from 'shadcn-solid-components/lib/cva'

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps extends ComponentProps<'div'> {
  /** Illustration or icon rendered above the title. */
  icon?: JSX.Element
  /** Primary heading. */
  title: string
  /** Supporting description text. */
  description?: string | JSX.Element
  /** Call-to-action element (e.g. a `<Button />`). */
  action?: JSX.Element
}

// ============================================================================
// Component
// ============================================================================

/**
 * A placeholder for empty lists, search results or permission walls.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<IconInbox class="size-12 text-muted-foreground" />}
 *   title="No messages"
 *   description="You haven't received any messages yet."
 *   action={<Button>Compose</Button>}
 * />
 * ```
 */
export function EmptyState(props: EmptyStateProps) {
  const [local, rest] = splitProps(props, ['class', 'icon', 'title', 'description', 'action'])

  return (
    <div
      data-slot="empty-state"
      class={cx(
        'flex flex-col items-center justify-center gap-4 px-4 py-12 text-center',
        local.class,
      )}
      {...rest}
    >
      <Show when={local.icon}>
        <div class="text-muted-foreground">{local.icon}</div>
      </Show>

      <div class="flex flex-col gap-1">
        <h3 class="text-lg font-semibold">{local.title}</h3>
        <Show when={local.description}>
          <p class="text-muted-foreground mx-auto max-w-sm text-sm">{local.description}</p>
        </Show>
      </div>

      <Show when={local.action}>
        <div class="mt-2">{local.action}</div>
      </Show>
    </div>
  )
}
