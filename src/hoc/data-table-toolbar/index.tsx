import { useLocale } from '@/components/config-provider'
import type { DataTableToolbarLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import type { Table } from '@tanstack/solid-table'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'
import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroupLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { IconSearch, IconX } from '@/components/icons'
import { cx } from '@/lib/cva'












// ============================================================================
// Types
// ============================================================================

export interface DataTableToolbarProps<TData> extends ComponentProps<'div'> {
  /** The TanStack table instance. */
  table: Table<TData>
  /**
   * Column id used for the global search input.
   * When omitted the search input is hidden.
   */
  searchColumn?: string
  /** Show the column visibility dropdown. Defaults to `true`. */
  showColumnToggle?: boolean
  /** Extra elements rendered between the search input and column toggle. */
  filters?: JSX.Element
  /** Extra action buttons rendered on the right side. */
  actions?: JSX.Element
  /** Locale overrides. */
  locale?: Partial<DataTableToolbarLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A toolbar for `TanstackTable` providing a search input, filter slot,
 * column visibility toggle and action buttons.
 *
 * @example
 * ```tsx
 * <DataTableToolbar
 *   table={table}
 *   searchColumn="name"
 *   actions={<Button size="sm">Export</Button>}
 * />
 * ```
 */
export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const [local, rest] = splitProps(props as DataTableToolbarProps<any>, [
    'class',
    'table',
    'searchColumn',
    'showColumnToggle',
    'filters',
    'actions',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): DataTableToolbarLocale => ({ ...defaultLocale, ...globalLocale.DataTableToolbar, ...local.locale })
  const showColumnToggle = () => local.showColumnToggle !== false

  const searchValue = () => {
    if (!local.searchColumn) return ''
    return (local.table.getColumn(local.searchColumn)?.getFilterValue() as string) ?? ''
  }

  const isFiltered = () => local.table.getState().columnFilters.length > 0

  return (
    <div
      data-slot="data-table-toolbar"
      class={cx('flex items-center justify-between gap-2', local.class)}
      {...rest}
    >
      <div class="flex flex-1 items-center gap-2">
        {/* Search */}
        <Show when={local.searchColumn}>
          <div class="relative w-full max-w-sm">
            <IconSearch class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder={locale().searchPlaceholder}
              value={searchValue()}
              onInput={e => {
                local.table.getColumn(local.searchColumn!)?.setFilterValue(e.currentTarget.value)
              }}
              class={cx(
                'placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full border bg-transparent py-1 pr-3 pl-8 text-sm shadow-xs transition-[color,box-shadow] outline-none',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'rounded-md',
              )}
            />
          </div>
        </Show>

        {/* Custom filter slot */}
        {local.filters}

        {/* Reset button */}
        <Show when={isFiltered()}>
          <Button variant="ghost" size="sm" onClick={() => local.table.resetColumnFilters()}>
            {locale().resetFilters}
            <IconX class="ml-1 size-4" />
          </Button>
        </Show>
      </div>

      <div class="flex items-center gap-2">
        {/* Action slot */}
        {local.actions}

        {/* Column visibility */}
        <Show when={showColumnToggle()}>
          <DropdownMenu>
            <DropdownMenuTrigger as={Button<'button'>} variant="outline" size="sm" class="ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 size-4" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"
                />
              </svg>
              {locale().columns}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroupLabel>{locale().columns}</DropdownMenuGroupLabel>
              <DropdownMenuSeparator />
              <For each={local.table.getAllColumns().filter(col => col.getCanHide())}>
                {column => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    onChange={value => column.toggleVisibility(!!value)}
                  >
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                )}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
      </div>
    </div>
  )
}
