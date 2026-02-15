import type { ComponentProps, JSX } from 'solid-js'
import {
  createContext,
  useContext,
  splitProps,
  For,
  Show,
  Switch,
  Match,
} from 'solid-js'
import type {
  Table,
  Row,
  Header,
  Cell,
  HeaderGroup,
  Column,
  ColumnDef,
  RowData,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  ExpandedState,
  GroupingState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
} from '@tanstack/solid-table'
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/solid-table'
import { cx } from '@/lib/cva'
import { Button } from '@/components/button'
import { Checkbox, CheckboxInput, CheckboxControl } from '@/components/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectPortal,
} from '@/components/select'
import { TextField, TextFieldInput } from '@/components/text-field'

import './index.css'

// ============================================================================
// Re-exports from @tanstack/solid-table
// ============================================================================

export {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
}

export type {
  Table,
  Row,
  Header,
  Cell,
  HeaderGroup,
  Column,
  ColumnDef,
  RowData,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  ExpandedState,
  GroupingState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
}

// ============================================================================
// Context
// ============================================================================

interface TanstackTableContextValue<TData = any> {
  table: Table<TData>
}

const TanstackTableCtx = createContext<TanstackTableContextValue>()

/**
 * Access the TanStack Table instance from context.
 * Must be used within a `<TanstackTable>` component.
 */
export function useTanstackTable<TData = any>(): Table<TData> {
  const ctx = useContext(TanstackTableCtx) as TanstackTableContextValue<TData> | undefined
  if (!ctx) {
    throw new Error('useTanstackTable must be used within a <TanstackTable> component')
  }
  return ctx.table
}

// ============================================================================
// TanstackTable — Root Component
// ============================================================================

export type TanstackTableRootProps<TData = any> = ComponentProps<'table'> & {
  /** The TanStack Table instance created via createSolidTable() */
  table: Table<TData>
}

/**
 * Root component that provides the table context and renders the HTML table.
 * All other TanstackTable* sub-components must be descendants of this component.
 *
 * @example
 * ```tsx
 * const table = createSolidTable({ ... })
 *
 * <TanstackTable table={table}>
 *   <TanstackTableHeader />
 *   <TanstackTableBody />
 * </TanstackTable>
 * ```
 */
export function TanstackTable<TData = any>(props: TanstackTableRootProps<TData>) {
  const [local, rest] = splitProps(props, ['table', 'children', 'class'])

  return (
    <TanstackTableCtx.Provider value={{ table: local.table as Table<any> }}>
      <div data-slot="tanstack-table-container" class="relative w-full overflow-x-auto">
        <table
          data-slot="tanstack-table"
          class={cx('w-full caption-bottom text-sm', local.class)}
          {...rest}
        >
          {local.children}
        </table>
      </div>
    </TanstackTableCtx.Provider>
  )
}

// ============================================================================
// TanstackTableHeader — Auto-renders header groups
// ============================================================================

export type TanstackTableHeaderProps = ComponentProps<'thead'>

/**
 * Auto-renders all header groups from the table context.
 * Supports column pinning and column resizing out of the box.
 * Pass `children` to fully override the default rendering.
 */
export function TanstackTableHeader(props: TanstackTableHeaderProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const table = useTanstackTable()

  const defaultContent = () => (
    <For each={table.getHeaderGroups()}>
      {(headerGroup) => (
        <tr data-slot="tanstack-table-header-row" class="border-b transition-colors">
          <For each={headerGroup.headers}>
            {(header) => {
              const pinned = () => header.column.getIsPinned()
              return (
                <th
                  data-slot="tanstack-table-head"
                  data-pinned={pinned() || undefined}
                  class={cx(
                    'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap',
                    '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                    header.column.getCanResize() && 'relative',
                    pinned() && 'sticky z-10 bg-background',
                  )}
                  colSpan={header.colSpan}
                  style={{
                    width: `${header.getSize()}px`,
                    ...(pinned() === 'left'
                      ? { left: `${header.column.getStart('left')}px` }
                      : {}),
                    ...(pinned() === 'right'
                      ? { right: `${header.column.getAfter('right')}px` }
                      : {}),
                  }}
                >
                  <Show when={!header.isPlaceholder}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Show>
                  <Show when={header.column.getCanResize()}>
                    <div
                      data-slot="tanstack-table-resize-handle"
                      data-resizing={header.column.getIsResizing() ? '' : undefined}
                      class="absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Show>
                </th>
              )
            }}
          </For>
        </tr>
      )}
    </For>
  )

  return (
    <thead data-slot="tanstack-table-header" class={cx('[&_tr]:border-b', local.class)} {...rest}>
      {local.children ?? defaultContent()}
    </thead>
  )
}

// ============================================================================
// TanstackTableBody — Auto-renders body rows
// ============================================================================

export type TanstackTableBodyProps = ComponentProps<'tbody'> & {
  /** Content to display when there are no rows. Defaults to "No results." */
  emptyContent?: JSX.Element
  /** Render function for expanded row sub-content (displayed below the expanded row) */
  renderSubComponent?: (row: Row<any>) => JSX.Element
}

/**
 * Auto-renders all rows from the table context.
 * Supports row selection, expansion, grouping, aggregation, and column pinning.
 * Pass `children` to fully override the default rendering.
 */
export function TanstackTableBody(props: TanstackTableBodyProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'emptyContent',
    'renderSubComponent',
    'children',
  ])
  const table = useTanstackTable()

  const defaultContent = () => (
    <Show
      when={table.getRowModel().rows.length > 0}
      fallback={
        <tr>
          <td
            data-slot="tanstack-table-empty"
            class="h-24 text-center text-muted-foreground"
            colSpan={table.getAllColumns().length}
          >
            {local.emptyContent ?? 'No results.'}
          </td>
        </tr>
      }
    >
      <For each={table.getRowModel().rows}>
        {(row) => (
          <>
            <tr
              data-slot="tanstack-table-row"
              data-state={row.getIsSelected() ? 'selected' : undefined}
              data-expanded={row.getIsExpanded() ? '' : undefined}
              data-grouped={row.getIsGrouped() ? '' : undefined}
              class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
            >
              <For each={row.getVisibleCells()}>
                {(cell) => {
                  const pinned = () => cell.column.getIsPinned()
                  return (
                    <td
                      data-slot="tanstack-table-cell"
                      data-pinned={pinned() || undefined}
                      class={cx(
                        'p-2 align-middle whitespace-nowrap',
                        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                        pinned() && 'sticky z-10 bg-background',
                      )}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        ...(pinned() === 'left'
                          ? { left: `${cell.column.getStart('left')}px` }
                          : {}),
                        ...(pinned() === 'right'
                          ? { right: `${cell.column.getAfter('right')}px` }
                          : {}),
                      }}
                    >
                      <Switch
                        fallback={flexRender(cell.column.columnDef.cell, cell.getContext())}
                      >
                        <Match when={cell.getIsGrouped()}>
                          <button
                            class="flex items-center gap-1 cursor-pointer font-medium"
                            onClick={row.getToggleExpandedHandler()}
                          >
                            <svg
                              class={cx(
                                'size-4 shrink-0 transition-transform duration-200',
                                row.getIsExpanded() && 'rotate-90',
                              )}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            <span class="text-muted-foreground ml-1 text-xs">
                              ({row.subRows.length})
                            </span>
                          </button>
                        </Match>
                        <Match when={cell.getIsAggregated()}>
                          {flexRender(
                            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Match>
                        <Match when={cell.getIsPlaceholder()}>{null}</Match>
                      </Switch>
                    </td>
                  )
                }}
              </For>
            </tr>
            {/* Expanded sub-component row */}
            <Show when={row.getIsExpanded() && local.renderSubComponent}>
              <tr data-slot="tanstack-table-expanded-row" class="border-b">
                <td colSpan={row.getVisibleCells().length} class="p-0">
                  {local.renderSubComponent!(row)}
                </td>
              </tr>
            </Show>
          </>
        )}
      </For>
    </Show>
  )

  return (
    <tbody
      data-slot="tanstack-table-body"
      class={cx('[&_tr:last-child]:border-0', local.class)}
      {...rest}
    >
      {local.children ?? defaultContent()}
    </tbody>
  )
}

// ============================================================================
// TanstackTableFooter — Auto-renders footer groups
// ============================================================================

export type TanstackTableFooterProps = ComponentProps<'tfoot'>

/**
 * Auto-renders footer groups from the table context.
 * Pass `children` to fully override the default rendering.
 */
export function TanstackTableFooter(props: TanstackTableFooterProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const table = useTanstackTable()

  const defaultContent = () => (
    <For each={table.getFooterGroups()}>
      {(footerGroup) => (
        <tr data-slot="tanstack-table-footer-row" class="border-b transition-colors">
          <For each={footerGroup.headers}>
            {(header) => (
              <td
                data-slot="tanstack-table-footer-cell"
                class="p-2 align-middle font-medium"
                colSpan={header.colSpan}
              >
                <Show when={!header.isPlaceholder}>
                  {flexRender(header.column.columnDef.footer, header.getContext())}
                </Show>
              </td>
            )}
          </For>
        </tr>
      )}
    </For>
  )

  return (
    <tfoot
      data-slot="tanstack-table-footer"
      class={cx('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', local.class)}
      {...rest}
    >
      {local.children ?? defaultContent()}
    </tfoot>
  )
}

// ============================================================================
// TanstackTableCaption
// ============================================================================

export type TanstackTableCaptionProps = ComponentProps<'caption'>

export function TanstackTableCaption(props: TanstackTableCaptionProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <caption
      data-slot="tanstack-table-caption"
      class={cx('text-muted-foreground mt-4 text-sm', local.class)}
      {...rest}
    />
  )
}

// ============================================================================
// TanstackTableColumnHeader — Sortable Column Header
// ============================================================================

export type TanstackTableColumnHeaderProps<TData = any, TValue = unknown> =
  ComponentProps<'button'> & {
    /** The column instance from TanStack Table */
    column: Column<TData, TValue>
    /** The display title for the column */
    title: string
  }

/**
 * A pre-styled sortable column header button.
 * Shows sort direction indicators and handles click-to-sort.
 * Supports multi-sort via Shift+Click.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Data>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => <TanstackTableColumnHeader column={column} title="Name" />,
 *   },
 * ]
 * ```
 */
export function TanstackTableColumnHeader<TData = any, TValue = unknown>(
  props: TanstackTableColumnHeaderProps<TData, TValue>,
) {
  const [local, rest] = splitProps(props, ['column', 'title', 'class'])

  return (
    <Show
      when={local.column.getCanSort()}
      fallback={<span class={cx(local.class)}>{local.title}</span>}
    >
      <button
        data-slot="tanstack-table-column-header"
        class={cx(
          'flex items-center gap-1 -ml-3 h-8 px-3 rounded-component',
          'text-muted-foreground hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          local.column.getIsSorted() && 'text-foreground',
          local.class,
        )}
        onClick={(e) => local.column.toggleSorting(undefined, e.shiftKey)}
        {...rest}
      >
        <span>{local.title}</span>
        <Switch
          fallback={
            // Unsorted icon (arrows up-down)
            <svg
              class="size-4 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          }
        >
          <Match when={local.column.getIsSorted() === 'asc'}>
            {/* Arrow up */}
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </Match>
          <Match when={local.column.getIsSorted() === 'desc'}>
            {/* Arrow down */}
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </Match>
        </Switch>
      </button>
    </Show>
  )
}

// ============================================================================
// TanstackTableHeaderCheckbox — Select-All Checkbox
// ============================================================================

export type TanstackTableHeaderCheckboxProps = {
  /** The table instance */
  table: Table<any>
  /** Additional CSS class */
  class?: string
}

/**
 * A checkbox for selecting/deselecting all rows on the current page.
 * Automatically shows indeterminate state when some rows are selected.
 *
 * @example
 * ```tsx
 * createSelectColumn() // or manually:
 * { header: ({ table }) => <TanstackTableHeaderCheckbox table={table} /> }
 * ```
 */
export function TanstackTableHeaderCheckbox(props: TanstackTableHeaderCheckboxProps) {
  return (
    <Checkbox
      data-slot="tanstack-table-header-checkbox"
      checked={props.table.getIsAllPageRowsSelected()}
      indeterminate={
        props.table.getIsSomePageRowsSelected() && !props.table.getIsAllPageRowsSelected()
      }
      onChange={(checked) => props.table.toggleAllPageRowsSelected(checked)}
      class={props.class}
      aria-label="Select all"
    >
      <CheckboxInput />
      <CheckboxControl />
    </Checkbox>
  )
}

// ============================================================================
// TanstackTableRowCheckbox — Row Selection Checkbox
// ============================================================================

export type TanstackTableRowCheckboxProps = {
  /** The row instance from TanStack Table */
  row: Row<any>
  /** Additional CSS class */
  class?: string
}

/**
 * A checkbox for selecting/deselecting a single row.
 *
 * @example
 * ```tsx
 * createSelectColumn() // or manually:
 * { cell: ({ row }) => <TanstackTableRowCheckbox row={row} /> }
 * ```
 */
export function TanstackTableRowCheckbox(props: TanstackTableRowCheckboxProps) {
  return (
    <Checkbox
      data-slot="tanstack-table-row-checkbox"
      checked={props.row.getIsSelected()}
      disabled={!props.row.getCanSelect()}
      onChange={(checked) => props.row.toggleSelected(checked)}
      class={props.class}
      aria-label="Select row"
    >
      <CheckboxInput />
      <CheckboxControl />
    </Checkbox>
  )
}

// ============================================================================
// TanstackTableExpandTrigger — Row Expand/Collapse Button
// ============================================================================

export type TanstackTableExpandTriggerProps = {
  /** The row instance from TanStack Table */
  row: Row<any>
  /** Additional CSS class */
  class?: string
}

/**
 * A button that toggles row expansion with a rotating chevron indicator.
 *
 * @example
 * ```tsx
 * createExpandColumn() // or manually:
 * { cell: ({ row }) => row.getCanExpand() && <TanstackTableExpandTrigger row={row} /> }
 * ```
 */
export function TanstackTableExpandTrigger(props: TanstackTableExpandTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      data-slot="tanstack-table-expand-trigger"
      class={cx('size-6 text-muted-foreground', props.class)}
      onClick={props.row.getToggleExpandedHandler()}
      disabled={!props.row.getCanExpand()}
      aria-label={props.row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
    >
      <svg
        class={cx(
          'size-4 shrink-0 transition-transform duration-200',
          props.row.getIsExpanded() && 'rotate-90',
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Button>
  )
}

// ============================================================================
// TanstackTableGlobalFilter — Global Search Input
// ============================================================================

export type TanstackTableGlobalFilterProps = {
  /** Additional CSS class for the input element */
  class?: string
  /** Placeholder text. Defaults to "Search..." */
  placeholder?: string
}

/**
 * A search input that filters all table columns globally.
 * Must be used within a `<TanstackTable>` context.
 */
export function TanstackTableGlobalFilter(props: TanstackTableGlobalFilterProps) {
  const table = useTanstackTable()

  return (
    <TextField
      data-slot="tanstack-table-global-filter"
      value={(table.getState().globalFilter as string) ?? ''}
      onChange={(value) => table.setGlobalFilter(value)}
      class="w-auto gap-0"
    >
      <TextFieldInput
        placeholder={props.placeholder ?? 'Search...'}
        class={cx('h-8 w-[200px]', props.class)}
      />
    </TextField>
  )
}

// ============================================================================
// TanstackTablePagination — Full Pagination Controls
// ============================================================================

export type TanstackTablePaginationProps = ComponentProps<'div'> & {
  /** Available page size options. Defaults to [10, 20, 30, 40, 50] */
  pageSizeOptions?: number[]
  /** Whether to show the row selection count. Defaults to true */
  showSelectedCount?: boolean
  /** Whether to show the page size selector. Defaults to true */
  showPageSize?: boolean
}

/**
 * Full pagination controls with page size selector, selection count, and page navigation.
 * Must be used within a `<TanstackTable>` context.
 */
export function TanstackTablePagination(props: TanstackTablePaginationProps) {
  const [local, rest] = splitProps(props, [
    'pageSizeOptions',
    'showSelectedCount',
    'showPageSize',
    'class',
  ])
  const table = useTanstackTable()

  const pageSizeOptions = () => local.pageSizeOptions ?? [10, 20, 30, 40, 50]
  const showSelectedCount = () => local.showSelectedCount !== false
  const showPageSize = () => local.showPageSize !== false

  return (
    <div
      data-slot="tanstack-table-pagination"
      class={cx('flex items-center justify-between gap-4 py-4', local.class)}
      {...rest}
    >
      {/* Selected row count */}
      <div class="text-muted-foreground flex-1 text-sm">
        <Show when={showSelectedCount()}>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </Show>
      </div>

      <div class="flex items-center gap-6 lg:gap-8">
        {/* Page size selector */}
        <Show when={showPageSize()}>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium whitespace-nowrap">Rows per page</span>
            <Select
              options={pageSizeOptions()}
              value={table.getState().pagination.pageSize}
              onChange={(value) => {
                if (value != null) table.setPageSize(value)
              }}
              disallowEmptySelection
              itemComponent={(itemProps) => (
                <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger
                size="sm"
                class="w-[70px]"
                data-slot="tanstack-table-page-size"
              >
                <SelectValue<number>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectPortal>
                <SelectContent />
              </SelectPortal>
            </Select>
          </div>
        </Show>

        {/* Page info */}
        <div class="text-sm font-medium whitespace-nowrap">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {Math.max(table.getPageCount(), 1)}
        </div>

        {/* Page navigation buttons */}
        <div class="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="icon-sm"
            data-slot="tanstack-table-pagination-first"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="icon-sm"
            data-slot="tanstack-table-pagination-prev"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon-sm"
            data-slot="tanstack-table-pagination-next"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="icon-sm"
            data-slot="tanstack-table-pagination-last"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 17 5-5-5-5" />
              <path d="m13 17 5-5-5-5" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Column Definition Helpers
// ============================================================================

/**
 * Creates a pre-configured row selection column definition.
 * Includes a header checkbox (select all) and row checkboxes.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Data>[] = [
 *   createSelectColumn(),
 *   { accessorKey: 'name', header: 'Name' },
 * ]
 * ```
 */
export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: '_select',
    header: ({ table }) => <TanstackTableHeaderCheckbox table={table} />,
    cell: ({ row }) => <TanstackTableRowCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
    maxSize: 40,
  }
}

/**
 * Creates a pre-configured row expansion column definition.
 * Shows a chevron button for expandable rows.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Data>[] = [
 *   createExpandColumn(),
 *   { accessorKey: 'name', header: 'Name' },
 * ]
 * ```
 */
export function createExpandColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: '_expand',
    header: () => null,
    cell: ({ row }) => (
      <Show when={row.getCanExpand()}>
        <TanstackTableExpandTrigger row={row} />
      </Show>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
    maxSize: 40,
  }
}
