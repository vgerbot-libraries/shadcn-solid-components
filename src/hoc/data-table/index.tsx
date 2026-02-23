import { useLocale } from '@/components/config-provider'
import type { DataTableLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'
import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/solid-table'
import {
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/solid-table'
import {
  TanstackTable,
  TanstackTableBody,
  TanstackTableHeader,
  TanstackTablePagination,
  TanstackTableProvider,
} from '@/components/tanstack-table'
import { Card } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { EmptyState } from '@/hoc/empty-state'
import { DataTableToolbar } from '@/hoc/data-table-toolbar'
import { cx } from '@/lib/cva'

// ============================================================================


export const enLocale: DataTableLocale = {
  toolbar: {},
  table: {},
  emptyTitle: 'No results',
  emptyDescription: 'No data to display.',
}

export const zhCNLocale: DataTableLocale = {
  toolbar: {},
  table: {},
  emptyTitle: '暂无数据',
  emptyDescription: '没有可显示的数据。',
}

export const zhTWLocale: DataTableLocale = {
  toolbar: {},
  table: {},
  emptyTitle: '暫無資料',
  emptyDescription: '沒有可顯示的資料。',
}

export const jaLocale: DataTableLocale = {
  toolbar: {},
  table: {},
  emptyTitle: 'データなし',
  emptyDescription: '表示するデータがありません。',
}

// ============================================================================
// Types
// ============================================================================

export interface DataTableProps<TData> extends ComponentProps<'div'> {
  /** Column definitions for the table. */
  columns: ColumnDef<TData, any>[]
  /** The data array to display. */
  data: TData[]
  /** When `true` a loading skeleton is shown instead of data. */
  loading?: boolean
  /** Number of skeleton rows to show while loading. Defaults to `5`. */
  loadingRows?: number
  /**
   * Column id used for the global search input.
   * When omitted the search input is hidden.
   */
  searchColumn?: string
  /** Show the column visibility dropdown. Defaults to `true`. */
  showColumnToggle?: boolean
  /** Extra filter elements rendered in the toolbar. */
  filters?: JSX.Element
  /** Extra action buttons rendered on the right side of the toolbar. */
  actions?: JSX.Element
  /** Show pagination controls. Defaults to `true`. */
  showPagination?: boolean
  /** Enable row selection. Defaults to `false`. */
  selectable?: boolean
  /** Custom empty-state icon. */
  emptyIcon?: JSX.Element
  /** Custom empty-state title. */
  emptyTitle?: string
  /** Custom empty-state description. */
  emptyDescription?: string
  /** Custom empty-state action element. */
  emptyAction?: JSX.Element
  /** Locale overrides. */
  locale?: Partial<DataTableLocale>
  /** Called when the table instance is created, for external access. */
  onTableReady?: (table: Table<TData>) => void
}

// ============================================================================
// Helpers
// ============================================================================

function LoadingSkeleton(props: { columns: number; rows: number }) {
  return (
    <div class="space-y-3 p-4">
      <div class="flex items-center gap-2">
        <Skeleton class="h-9 w-full max-w-sm" />
        <Skeleton class="ml-auto h-9 w-24" />
      </div>
      <div class="rounded-md border">
        <div class="border-b p-3">
          <div class="flex gap-4">
            <For each={Array.from({ length: props.columns })}>
              {() => <Skeleton class="h-4 flex-1" />}
            </For>
          </div>
        </div>
        <For each={Array.from({ length: props.rows })}>
          {() => (
            <div class="border-b p-3 last:border-b-0">
              <div class="flex gap-4">
                <For each={Array.from({ length: props.columns })}>
                  {() => <Skeleton class="h-4 flex-1" />}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A full-featured data table combining `TanstackTable`, `DataTableToolbar`,
 * pagination, loading skeleton and empty state into a single declarative HOC.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={users()}
 *   loading={isLoading()}
 *   searchColumn="name"
 *   actions={<Button size="sm">Export</Button>}
 * />
 * ```
 */
export function DataTable<TData>(props: DataTableProps<TData>) {
  const [local, rest] = splitProps(props as DataTableProps<any>, [
    'class',
    'columns',
    'data',
    'loading',
    'loadingRows',
    'searchColumn',
    'showColumnToggle',
    'filters',
    'actions',
    'showPagination',
    'selectable',
    'emptyIcon',
    'emptyTitle',
    'emptyDescription',
    'emptyAction',
    'locale',
    'onTableReady',
  ])

  const globalLocale = useLocale()
  const locale = (): DataTableLocale => ({ ...defaultLocale, ...globalLocale.DataTable, ...local.locale })
  const showPagination = () => local.showPagination !== false

  const [sorting, setSorting] = createSignal<SortingState>([])
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({})

  const table = createSolidTable({
    get data() {
      return local.data ?? []
    },
    get columns() {
      return local.columns
    },
    state: {
      get sorting() {
        return sorting()
      },
      get columnFilters() {
        return columnFilters()
      },
      get columnVisibility() {
        return columnVisibility()
      },
      get rowSelection() {
        return rowSelection()
      },
    },
    enableRowSelection: local.selectable ?? false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  local.onTableReady?.(table)

  return (
    <div data-slot="data-table" class={cx('flex flex-col gap-4', local.class)} {...rest}>
      <Show
        when={!local.loading}
        fallback={
          <LoadingSkeleton
            columns={Math.min(local.columns.length, 6)}
            rows={local.loadingRows ?? 5}
          />
        }
      >
        <TanstackTableProvider table={table} locale={locale().table}>
          <DataTableToolbar
            table={table}
            searchColumn={local.searchColumn}
            showColumnToggle={local.showColumnToggle}
            filters={local.filters}
            actions={local.actions}
            locale={locale().toolbar}
          />

          <div class="rounded-md border">
            <Show
              when={table.getRowModel().rows.length > 0}
              fallback={
                <EmptyState
                  icon={local.emptyIcon}
                  title={local.emptyTitle ?? locale().emptyTitle}
                  description={local.emptyDescription ?? locale().emptyDescription}
                  action={local.emptyAction}
                />
              }
            >
              <TanstackTable>
                <TanstackTableHeader />
                <TanstackTableBody />
              </TanstackTable>
            </Show>
          </div>

          <Show when={showPagination()}>
            <TanstackTablePagination />
          </Show>
        </TanstackTableProvider>
      </Show>
    </div>
  )
}
