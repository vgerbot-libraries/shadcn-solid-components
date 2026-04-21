import { cx } from 'shadcn-solid-components/lib/cva'
import type { VoidProps } from 'solid-js'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'

// ============================================================================
// Breadcrumb (nav wrapper)
// ============================================================================

export type BreadcrumbProps = ComponentProps<'nav'>

export function Breadcrumb(props: BreadcrumbProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      class={cx(local.class)}
      {...rest}
    />
  )
}

// ============================================================================
// BreadcrumbList
// ============================================================================

export type BreadcrumbListProps = ComponentProps<'ol'>

export function BreadcrumbList(props: BreadcrumbListProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <ol
      data-slot="breadcrumb-list"
      class={cx(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        local.class,
      )}
      {...rest}
    />
  )
}

// ============================================================================
// BreadcrumbItem
// ============================================================================

export type BreadcrumbItemProps = ComponentProps<'li'>

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <li
      data-slot="breadcrumb-item"
      class={cx('inline-flex items-center gap-1.5', local.class)}
      {...rest}
    />
  )
}

// ============================================================================
// BreadcrumbLink
// ============================================================================

export type BreadcrumbLinkProps = ComponentProps<'a'>

export function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <a
      data-slot="breadcrumb-link"
      class={cx('hover:text-foreground transition-colors', local.class)}
      {...rest}
    />
  )
}

// ============================================================================
// BreadcrumbPage
// ============================================================================

export type BreadcrumbPageProps = ComponentProps<'span'>

export function BreadcrumbPage(props: BreadcrumbPageProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      class={cx('text-foreground font-normal', local.class)}
      {...rest}
    />
  )
}

// ============================================================================
// BreadcrumbSeparator
// ============================================================================

export type BreadcrumbSeparatorProps = ComponentProps<'li'>

export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      class={cx('[&>svg]:size-3.5', local.class)}
      {...rest}
    >
      <Show
        when={local.children}
        fallback={
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18l6-6l-6-6"
            />
          </svg>
        }
      >
        {local.children}
      </Show>
    </li>
  )
}

// ============================================================================
// BreadcrumbEllipsis
// ============================================================================

export type BreadcrumbEllipsisProps = VoidProps<ComponentProps<'span'>>

export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      class={cx('flex size-9 items-center justify-center', local.class)}
      {...rest}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </g>
      </svg>
      <span class="sr-only">More</span>
    </span>
  )
}
