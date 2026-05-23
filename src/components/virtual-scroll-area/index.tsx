import { createVirtualizer } from '@tanstack/solid-virtual'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type Accessor,
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  Match,
  Show,
  Switch,
  splitProps,
} from 'solid-js'

export type VirtualScrollMode = 'vertical' | 'horizontal' | 'both'

type MaybeAccessor<T> = T | Accessor<T>

export interface VirtualScrollRowRenderContext {
  rowIndex: number
}

export interface VirtualScrollColumnRenderContext {
  columnIndex: number
}

export interface VirtualScrollCellRenderContext {
  rowIndex: number
  columnIndex: number
}

export interface VirtualScrollAreaProps extends ComponentProps<'div'> {
  mode?: VirtualScrollMode
  rowCount?: MaybeAccessor<number>
  columnCount?: MaybeAccessor<number>
  overscan?: number
  loadMoreThreshold?: number
  estimateRowSize?: (index: number) => number
  estimateColumnSize?: (index: number) => number
  measureRow?: boolean
  measureColumn?: boolean
  hasMoreRows?: MaybeAccessor<boolean>
  hasMoreColumns?: MaybeAccessor<boolean>
  onLoadMoreRows?: () => void | Promise<void>
  onLoadMoreColumns?: () => void | Promise<void>
  renderRow?: (context: VirtualScrollRowRenderContext) => JSX.Element
  renderColumn?: (context: VirtualScrollColumnRenderContext) => JSX.Element
  renderCell?: (context: VirtualScrollCellRenderContext) => JSX.Element
  viewportClass?: string
  innerClass?: string
  empty?: string | JSX.Element
}

function resolveValue<T>(value: MaybeAccessor<T> | undefined, fallback: T): T {
  if (typeof value === 'function') {
    return (value as Accessor<T>)()
  }

  return value ?? fallback
}

function normalizeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.floor(value))
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value
}

export const VirtualScrollArea = (props: VirtualScrollAreaProps) => {
  const [local, rest] = splitProps(props, [
    'class',
    'mode',
    'rowCount',
    'columnCount',
    'overscan',
    'loadMoreThreshold',
    'estimateRowSize',
    'estimateColumnSize',
    'measureRow',
    'measureColumn',
    'hasMoreRows',
    'hasMoreColumns',
    'onLoadMoreRows',
    'onLoadMoreColumns',
    'renderRow',
    'renderColumn',
    'renderCell',
    'viewportClass',
    'innerClass',
    'empty',
  ])

  const componentClass = useComponentClass(ComponentName.VirtualScrollArea, props)

  let viewportRef: HTMLDivElement | undefined

  const mode = createMemo(() => local.mode ?? 'vertical')
  const overscan = createMemo(() => local.overscan ?? 8)
  const loadMoreThreshold = createMemo(() => local.loadMoreThreshold ?? 5)

  const rowCount = createMemo(() => normalizeCount(resolveValue(local.rowCount, 0)))
  const columnCount = createMemo(() => {
    const fallback = mode() === 'horizontal' ? rowCount() : 0
    return normalizeCount(resolveValue(local.columnCount, fallback))
  })

  const estimateRowSize = createMemo(() => local.estimateRowSize ?? (() => 48))
  const estimateColumnSize = createMemo(() => local.estimateColumnSize ?? (() => 120))

  const hasRows = createMemo(() => rowCount() > 0)
  const hasColumns = createMemo(() => columnCount() > 0)

  const rowVirtualizer = createVirtualizer({
    get count() {
      if (mode() === 'horizontal') {
        return 0
      }

      return rowCount()
    },
    getScrollElement: () => viewportRef ?? null,
    estimateSize: (index: number) => estimateRowSize()(index),
    get overscan() {
      return overscan()
    },
  })

  const columnVirtualizer = createVirtualizer({
    get count() {
      if (mode() === 'vertical') {
        return 0
      }

      return columnCount()
    },
    getScrollElement: () => viewportRef ?? null,
    estimateSize: (index: number) => estimateColumnSize()(index),
    horizontal: true,
    get overscan() {
      return overscan()
    },
  })

  const virtualRows = createMemo(() => rowVirtualizer.getVirtualItems())
  const virtualColumns = createMemo(() => columnVirtualizer.getVirtualItems())
  const totalRowSize = createMemo(() => rowVirtualizer.getTotalSize())
  const totalColumnSize = createMemo(() => columnVirtualizer.getTotalSize())

  const [rowLoadPending, setRowLoadPending] = createSignal(false)
  const [rowLoadMarker, setRowLoadMarker] = createSignal<number | null>(null)
  const [columnLoadPending, setColumnLoadPending] = createSignal(false)
  const [columnLoadMarker, setColumnLoadMarker] = createSignal<number | null>(null)

  const triggerLoadMoreRows = () => {
    const handler = local.onLoadMoreRows
    const count = rowCount()

    if (!handler) {
      return
    }

    if (rowLoadPending()) {
      return
    }

    if (rowLoadMarker() !== null && count <= (rowLoadMarker() ?? 0)) {
      return
    }

    setRowLoadPending(true)
    setRowLoadMarker(count)

    const result = handler()
    if (isPromiseLike(result)) {
      Promise.resolve(result).finally(() => setRowLoadPending(false))
      return
    }

    queueMicrotask(() => setRowLoadPending(false))
  }

  const triggerLoadMoreColumns = () => {
    const handler = local.onLoadMoreColumns
    const count = columnCount()

    if (!handler) {
      return
    }

    if (columnLoadPending()) {
      return
    }

    if (columnLoadMarker() !== null && count <= (columnLoadMarker() ?? 0)) {
      return
    }

    setColumnLoadPending(true)
    setColumnLoadMarker(count)

    const result = handler()
    if (isPromiseLike(result)) {
      Promise.resolve(result).finally(() => setColumnLoadPending(false))
      return
    }

    queueMicrotask(() => setColumnLoadPending(false))
  }

  createEffect(() => {
    const marker = rowLoadMarker()
    if (marker === null) {
      return
    }

    if (rowCount() > marker || !resolveValue(local.hasMoreRows, false)) {
      setRowLoadMarker(null)
    }
  })

  createEffect(() => {
    const marker = columnLoadMarker()
    if (marker === null) {
      return
    }

    if (columnCount() > marker || !resolveValue(local.hasMoreColumns, false)) {
      setColumnLoadMarker(null)
    }
  })

  createEffect(() => {
    if (!(mode() === 'vertical' || mode() === 'both')) {
      return
    }

    if (!local.onLoadMoreRows || !resolveValue(local.hasMoreRows, false) || rowCount() === 0) {
      return
    }

    const rows = virtualRows()
    const lastRow = rows[rows.length - 1]

    if (!lastRow) {
      return
    }

    if (lastRow.index >= rowCount() - 1 - loadMoreThreshold()) {
      triggerLoadMoreRows()
    }
  })

  createEffect(() => {
    if (!(mode() === 'horizontal' || mode() === 'both')) {
      return
    }

    if (
      !local.onLoadMoreColumns ||
      !resolveValue(local.hasMoreColumns, false) ||
      columnCount() === 0
    ) {
      return
    }

    const columns = virtualColumns()
    const lastColumn = columns[columns.length - 1]

    if (!lastColumn) {
      return
    }

    if (lastColumn.index >= columnCount() - 1 - loadMoreThreshold()) {
      triggerLoadMoreColumns()
    }
  })

  const showEmpty = createMemo(() => {
    if (mode() === 'vertical') {
      return !hasRows()
    }

    if (mode() === 'horizontal') {
      return !hasColumns()
    }

    return !hasRows() || !hasColumns()
  })

  return (
    <div
      data-slot="virtual-scroll-area"
      class={cx('relative overflow-hidden rounded-component', componentClass, local.class)}
      {...rest}
    >
      <div
        data-slot="virtual-scroll-area-viewport"
        ref={viewportRef}
        class={cx(
          'size-full',
          mode() === 'vertical' && 'overflow-y-auto overflow-x-hidden',
          mode() === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          mode() === 'both' && 'overflow-auto',
          local.viewportClass,
        )}
      >
        <Show
          when={!showEmpty()}
          fallback={
            <Show when={local.empty !== undefined}>
              <div
                data-slot="virtual-scroll-area-empty"
                class="text-muted-foreground flex min-h-24 items-center justify-center px-4 py-8 text-sm"
              >
                {local.empty}
              </div>
            </Show>
          }
        >
          <Switch>
            <Match when={mode() === 'vertical'}>
              <div
                data-slot="virtual-scroll-area-content"
                class={cx('relative w-full', local.innerClass)}
                style={{ height: `${totalRowSize()}px` }}
              >
                <For each={virtualRows()}>
                  {row => (
                    <div
                      data-slot="virtual-scroll-area-item"
                      data-index={row.index}
                      ref={element => {
                        if (local.measureRow) {
                          rowVirtualizer.measureElement(element)
                        }
                      }}
                      class="absolute left-0 w-full"
                      style={{
                        transform: `translateY(${row.start}px)`,
                        height: local.measureRow ? undefined : `${row.size}px`,
                      }}
                    >
                      {local.renderRow?.({ rowIndex: row.index })}
                    </div>
                  )}
                </For>
              </div>
            </Match>

            <Match when={mode() === 'horizontal'}>
              <div
                data-slot="virtual-scroll-area-content"
                class={cx('relative h-full min-h-full', local.innerClass)}
                style={{ width: `${totalColumnSize()}px` }}
              >
                <For each={virtualColumns()}>
                  {column => (
                    <div
                      data-slot="virtual-scroll-area-item"
                      data-index={column.index}
                      ref={element => {
                        if (local.measureColumn) {
                          columnVirtualizer.measureElement(element)
                        }
                      }}
                      class="absolute top-0 h-full"
                      style={{
                        transform: `translateX(${column.start}px)`,
                        width: local.measureColumn ? undefined : `${column.size}px`,
                      }}
                    >
                      {local.renderColumn?.({ columnIndex: column.index })}
                    </div>
                  )}
                </For>
              </div>
            </Match>

            <Match when={mode() === 'both'}>
              <div
                data-slot="virtual-scroll-area-content"
                class={cx('relative', local.innerClass)}
                style={{
                  height: `${totalRowSize()}px`,
                  width: `${totalColumnSize()}px`,
                }}
              >
                <For each={virtualRows()}>
                  {row => (
                    <div
                      data-slot="virtual-scroll-area-row"
                      data-index={row.index}
                      ref={element => {
                        if (local.measureRow) {
                          rowVirtualizer.measureElement(element)
                        }
                      }}
                      class="absolute left-0"
                      style={{
                        transform: `translateY(${row.start}px)`,
                        width: `${totalColumnSize()}px`,
                        height: local.measureRow ? undefined : `${row.size}px`,
                      }}
                    >
                      <For each={virtualColumns()}>
                        {column => (
                          <div
                            data-slot="virtual-scroll-area-cell"
                            data-index={column.index}
                            ref={element => {
                              if (local.measureColumn && row.index === 0) {
                                columnVirtualizer.measureElement(element)
                              }
                            }}
                            class="absolute top-0"
                            style={{
                              transform: `translateX(${column.start}px)`,
                              width: local.measureColumn ? undefined : `${column.size}px`,
                              height: `${row.size}px`,
                            }}
                          >
                            {local.renderCell?.({ rowIndex: row.index, columnIndex: column.index })}
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </Match>
          </Switch>
        </Show>
      </div>
    </div>
  )
}
