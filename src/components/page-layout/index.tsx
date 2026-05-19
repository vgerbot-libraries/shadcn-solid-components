import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'

// ============================================================================
// PageLayout
// ============================================================================

export interface PageLayoutProps extends ComponentProps<'div'> {
  /**
   * Optional header slot rendered as the first child of the scrollable body
   * (typically a `PageLayoutHeader`). The header is placed inside the scroll
   * container so it can opt in to sticky behavior via `PageLayoutHeader`'s
   * `fixed` prop.
   */
  header?: JSX.Element
  /** Override classes applied to the scrollable body container. */
  bodyClass?: string
  /** Escape-hatch attributes forwarded to the scrollable body container. */
  bodyProps?: ComponentProps<'div'>
  /** Override classes applied to the inner content wrapper (padding / gap). */
  contentClass?: string
  /** Escape-hatch attributes forwarded to the inner content wrapper. */
  contentProps?: ComponentProps<'div'>
  /** Page body content. */
  children: JSX.Element
}

export function PageLayout(props: PageLayoutProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'header',
    'bodyClass',
    'bodyProps',
    'contentClass',
    'contentProps',
    'children',
  ])

  return (
    <div
      data-slot="page-layout"
      class={cx('flex h-full min-h-0 flex-1 flex-col', local.class)}
      {...rest}
    >
      <div
        data-slot="page-layout-body"
        class={cx('flex flex-1 flex-col overflow-auto', local.bodyClass)}
        {...local.bodyProps}
      >
        <Show when={local.header}>{local.header}</Show>
        <div
          data-slot="page-layout-content"
          class={cx('flex flex-1 flex-col gap-6 p-4 md:p-6', local.contentClass)}
          {...local.contentProps}
        >
          {local.children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PageLayoutHeader
// ============================================================================

export interface PageLayoutHeaderProps extends ComponentProps<'header'> {
  /** Left-most slot (e.g. sidebar trigger, back button). */
  leading?: JSX.Element
  /** Main area, flex-1 (e.g. breadcrumb, title, search). */
  content?: JSX.Element
  /** Right-aligned action buttons (e.g. notifications, user menu). */
  actions?: JSX.Element
  /** Far-right utility slot (e.g. theme toggle). */
  trailing?: JSX.Element
  /**
   * When `true` (default) the header sticks to the top of the scrollable body
   * via `position: sticky` while content scrolls underneath. When `false`, the
   * header scrolls together with the body content.
   */
  fixed?: boolean
  /**
   * When provided, all named slots are ignored and children fills the header
   * directly — useful for fully custom layouts.
   */
  children?: JSX.Element
}

export function PageLayoutHeader(props: PageLayoutHeaderProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'leading',
    'content',
    'actions',
    'trailing',
    'fixed',
    'children',
  ])

  const isFixed = () => local.fixed !== false

  return (
    <header
      data-slot="page-layout-header"
      data-fixed={isFixed() ? '' : undefined}
      class={cx(
        'flex h-16 shrink-0 items-center gap-2 border-b px-4',
        isFixed() && 'bg-background sticky top-0 z-10',
        local.class,
      )}
      {...rest}
    >
      <Show
        when={local.children}
        fallback={
          <>
            <Show when={local.leading}>
              <div data-slot="page-layout-header-leading" class="flex shrink-0 items-center gap-2">
                {local.leading}
              </div>
            </Show>
            <Show when={local.content}>
              <div
                data-slot="page-layout-header-content"
                class="flex flex-1 min-w-0 items-center gap-2"
              >
                {local.content}
              </div>
            </Show>
            <Show when={local.actions}>
              <div data-slot="page-layout-header-actions" class="flex shrink-0 items-center gap-2">
                {local.actions}
              </div>
            </Show>
            <Show when={local.trailing}>
              <div data-slot="page-layout-header-trailing" class="flex shrink-0 items-center gap-2">
                {local.trailing}
              </div>
            </Show>
          </>
        }
      >
        {local.children}
      </Show>
    </header>
  )
}
