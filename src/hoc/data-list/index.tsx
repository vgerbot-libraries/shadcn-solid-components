import { Button } from 'shadcn-solid-components/components/button'
import { Checkbox, CheckboxControl } from 'shadcn-solid-components/components/checkbox'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  List,
  ListBody,
  ListEmpty,
  ListHeader,
  ListItem,
  ListItemActions,
  ListItemAside,
  ListItemContent,
  ListItemDescription,
  type ListItemLayout,
  ListItemMain,
  ListItemMedia,
  ListItemSubTitle,
  ListItemTitle,
  ListItemType,
  type ListSize,
  ListSkeleton,
  ListToolbar,
  type ListVariant,
} from 'shadcn-solid-components/components/list'
import type { DataListLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================

export const enLocale: DataListLocale = {
  searchPlaceholder: 'Search...',
  emptyText: 'No data',
  reload: 'Reload',
  reset: 'Reset',
  expand: 'Expand row',
  collapse: 'Collapse row',
}

export const zhCNLocale: DataListLocale = {
  searchPlaceholder: '搜索...',
  emptyText: '暂无数据',
  reload: '刷新',
  reset: '重置',
  expand: '展开',
  collapse: '收起',
}

export const zhTWLocale: DataListLocale = {
  searchPlaceholder: '搜尋...',
  emptyText: '暫無資料',
  reload: '重新整理',
  reset: '重設',
  expand: '展開',
  collapse: '收合',
}

export const jaLocale: DataListLocale = {
  searchPlaceholder: '検索...',
  emptyText: 'データなし',
  reload: '再読み込み',
  reset: 'リセット',
  expand: '展開',
  collapse: '折りたたむ',
}

// ============================================================================
// Types
// ============================================================================

export type DataListSlot =
  | 'title'
  | 'subTitle'
  | 'avatar'
  | 'description'
  | 'content'
  | 'actions'
  | 'aside'
  | 'type'

export interface DataListColumn<TData> {
  key?: string
  title?: string
  dataIndex?: keyof TData | string | Array<string | number>
  listSlot?: DataListSlot
  search?: boolean
  valueEnum?: Record<string, { text: string }>
  render?: (value: unknown, record: TData, index: number) => JSX.Element
}

export interface DataListRequestParams {
  current?: number
  pageSize?: number
  keyword?: string
}

export interface DataListRequestResult<TData> {
  data: TData[]
  success?: boolean
  total?: number
}

export interface DataListActionType {
  reload: (resetPageIndex?: boolean) => Promise<void>
  reloadAndRest: () => Promise<void>
  reset: () => Promise<void>
  clearSelected: () => void
}

export interface DataListActionRef {
  current?: DataListActionType | undefined
}

export interface DataListRowSelection<TData> {
  selectedRowKeys?: string[]
  onChange?: (selectedRowKeys: string[], selectedRows: TData[]) => void
}

export interface DataListExpandable<TData> {
  expandedRowKeys?: string[]
  onExpandedRowsChange?: (expandedRowKeys: string[]) => void
  expandedRowRender?: (record: TData, index: number) => JSX.Element
}

export interface DataListPagination {
  current?: number
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface DataListSearch {
  placeholder?: string
}

export interface DataListProps<TData, TParams extends Record<string, any> = Record<string, any>>
  extends Omit<ComponentProps<'div'>, 'onLoad' | 'search'> {
  columns: DataListColumn<TData>[]
  dataSource?: TData[]
  request?: (params: TParams & DataListRequestParams) => Promise<DataListRequestResult<TData>>
  params?: TParams
  postData?: (data: TData[]) => TData[]
  rowKey?: keyof TData | ((row: TData, index: number) => string)
  headerTitle?: JSX.Element
  tooltip?: JSX.Element
  loading?: boolean
  split?: boolean
  variant?: ListVariant
  size?: ListSize
  itemLayout?: ListItemLayout
  search?: false | DataListSearch
  pagination?: false | DataListPagination
  manualRequest?: boolean
  actionRef?: DataListActionRef
  rowSelection?: DataListRowSelection<TData>
  expandable?: DataListExpandable<TData>
  toolBarRender?: (action: DataListActionType) => JSX.Element
  itemRender?: (item: TData, index: number, defaultDom: JSX.Element) => JSX.Element
  onItem?: (item: TData, index: number) => void
  onLoad?: (dataSource: TData[]) => void
  onLoadingChange?: (loading: boolean) => void
  onRequestError?: (error: Error) => void
  locale?: Partial<DataListLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function getByDataIndex<TData>(record: TData, dataIndex?: DataListColumn<TData>['dataIndex']) {
  if (!dataIndex) return undefined

  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>((acc, key) => {
      if (acc === undefined || acc === null) return undefined
      return (acc as Record<string, unknown>)[String(key)]
    }, record)
  }

  return (record as Record<string, unknown>)[String(dataIndex)]
}

function normalizeTextValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function mergeUniqueKeys(base: string[], incoming: string[]) {
  const set = new Set(base)
  for (const key of incoming) set.add(key)
  return Array.from(set)
}

// ============================================================================
// Component
// ============================================================================

/**
 * DataList composes List primitives and adds ProList-style orchestration:
 * columns + listSlot mapping, request lifecycle, search, pagination, selection,
 * expandable rows, and actionRef controls.
 */
export function DataList<TData, TParams extends Record<string, any> = Record<string, any>>(
  props: DataListProps<TData, TParams>,
) {
  const [local, rest] = splitProps(props as DataListProps<TData, TParams>, [
    'class',
    'columns',
    'dataSource',
    'request',
    'params',
    'postData',
    'rowKey',
    'headerTitle',
    'tooltip',
    'loading',
    'split',
    'variant',
    'size',
    'itemLayout',
    'search',
    'pagination',
    'manualRequest',
    'actionRef',
    'rowSelection',
    'expandable',
    'toolBarRender',
    'itemRender',
    'onItem',
    'onLoad',
    'onLoadingChange',
    'onRequestError',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): DataListLocale => ({
    ...defaultLocale,
    ...globalLocale.DataList,
    ...local.locale,
  })

  const [keyword, setKeyword] = createSignal('')
  const [internalLoading, setInternalLoading] = createSignal(false)
  const [requestData, setRequestData] = createSignal<TData[]>([])
  const [total, setTotal] = createSignal(0)

  const [internalSelectedKeys, setInternalSelectedKeys] = createSignal<string[]>([])
  const [internalExpandedKeys, setInternalExpandedKeys] = createSignal<string[]>([])

  const paginationConfig = createMemo<DataListPagination | undefined>(() =>
    local.pagination === false ? undefined : local.pagination,
  )
  const searchConfig = createMemo<DataListSearch | undefined>(() =>
    local.search === false ? undefined : (local.search ?? {}),
  )
  const rowSelectionConfig = createMemo<DataListRowSelection<TData> | undefined>(() =>
    local.rowSelection ? local.rowSelection : undefined,
  )
  const expandableConfig = createMemo<DataListExpandable<TData> | undefined>(() =>
    local.expandable ? local.expandable : undefined,
  )

  const defaultCurrent = () => paginationConfig()?.current ?? 1
  const defaultPageSize = () => paginationConfig()?.pageSize ?? 10

  const [current, setCurrent] = createSignal(defaultCurrent())
  const [pageSize, setPageSize] = createSignal(defaultPageSize())

  const searchEnabled = () => searchConfig() !== undefined
  const paginationEnabled = () => local.pagination !== false
  const requestEnabled = () => typeof local.request === 'function'

  const getRowKey = (record: TData, index: number): string => {
    if (typeof local.rowKey === 'function') return local.rowKey(record, index)
    if (typeof local.rowKey === 'string') {
      return normalizeTextValue((record as Record<string, unknown>)[local.rowKey]) || `${index}`
    }

    const candidate = (record as Record<string, unknown>).id
    return normalizeTextValue(candidate) || `${index}`
  }

  const action = {
    reload: async (resetPageIndex?: boolean) => {
      if (resetPageIndex) setCurrent(1)
      if (requestEnabled()) {
        await fetchData(resetPageIndex ?? false)
      }
    },
    reloadAndRest: async () => {
      setKeyword('')
      setCurrent(1)
      setInternalSelectedKeys([])
      setInternalExpandedKeys([])

      if (requestEnabled()) {
        await fetchData(true)
      }
    },
    reset: async () => {
      setKeyword('')
      setCurrent(defaultCurrent())
      setPageSize(defaultPageSize())
      setInternalSelectedKeys([])
      setInternalExpandedKeys([])

      if (requestEnabled()) {
        await fetchData(true)
      }
    },
    clearSelected: () => {
      setInternalSelectedKeys([])
      rowSelectionConfig()?.onChange?.([], [])
    },
  } satisfies DataListActionType

  if (local.actionRef) {
    local.actionRef.current = action
  }

  const sourceData = createMemo(() => {
    const base = requestEnabled() ? requestData() : (local.dataSource ?? [])
    const transformed = local.postData ? local.postData(base) : base

    if (!searchEnabled()) return transformed

    const q = keyword().trim().toLowerCase()
    if (!q) return transformed

    const searchableColumns = local.columns.filter(column => column.search !== false)

    return transformed.filter((record, index) => {
      for (const column of searchableColumns) {
        const rawValue = getByDataIndex(record, column.dataIndex)
        const text = normalizeTextValue(rawValue).toLowerCase()
        if (text.includes(q)) return true

        if (column.render) {
          const rendered = column.render(rawValue, record, index)
          const renderedText = normalizeTextValue(rendered).toLowerCase()
          if (renderedText.includes(q)) return true
        }
      }

      return false
    })
  })

  const pagedData = createMemo(() => {
    const base = sourceData()

    if (!paginationEnabled() || requestEnabled()) {
      return base
    }

    const start = (current() - 1) * pageSize()
    return base.slice(start, start + pageSize())
  })

  const resolvedTotal = createMemo(() => {
    if (!paginationEnabled()) return sourceData().length
    if (requestEnabled()) return total()
    return sourceData().length
  })

  const resolvedSelectedKeys = createMemo(() => {
    if (rowSelectionConfig()?.selectedRowKeys) {
      return rowSelectionConfig()?.selectedRowKeys ?? []
    }
    return internalSelectedKeys()
  })

  const resolvedExpandedKeys = createMemo(() => {
    if (expandableConfig()?.expandedRowKeys) {
      return expandableConfig()?.expandedRowKeys ?? []
    }
    return internalExpandedKeys()
  })

  const fetchData = async (resetPageIndex: boolean) => {
    if (!local.request) return

    setInternalLoading(true)
    local.onLoadingChange?.(true)

    try {
      const nextCurrent = resetPageIndex ? 1 : current()
      const response = await local.request({
        ...(local.params ?? ({} as TParams)),
        current: nextCurrent,
        pageSize: pageSize(),
        keyword: searchEnabled() ? keyword() : undefined,
      })

      if (response.success === false) {
        setRequestData([])
        setTotal(0)
      } else {
        const rows = response.data ?? []
        setRequestData(rows)
        setTotal(response.total ?? rows.length)
        local.onLoad?.(rows)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('DataList request failed')
      local.onRequestError?.(err)
      setRequestData([])
      setTotal(0)
    } finally {
      setInternalLoading(false)
      local.onLoadingChange?.(false)
    }
  }

  createEffect(() => {
    if (!requestEnabled() || local.manualRequest) return

    current()
    pageSize()
    keyword()
    JSON.stringify(local.params ?? {})

    void fetchData(false)
  })

  const toggleSelect = (key: string) => {
    if (!rowSelectionConfig()) return

    const selected = resolvedSelectedKeys()
    const next = selected.includes(key) ? selected.filter(item => item !== key) : [...selected, key]

    setInternalSelectedKeys(next)

    const selectedRows = sourceData().filter((record, index) =>
      next.includes(getRowKey(record, index)),
    )
    rowSelectionConfig()?.onChange?.(next, selectedRows)
  }

  const toggleExpand = (key: string) => {
    if (!expandableConfig()) return

    const expanded = resolvedExpandedKeys()
    const next = expanded.includes(key)
      ? expanded.filter(item => item !== key)
      : mergeUniqueKeys(expanded, [key])

    setInternalExpandedKeys(next)
    expandableConfig()?.onExpandedRowsChange?.(next)
  }

  const renderSlot = (record: TData, index: number, slot: DataListSlot) => {
    const mapped = local.columns.filter(column => column.listSlot === slot)

    if (mapped.length === 0) return null

    return (
      <For each={mapped}>
        {column => {
          const rawValue = getByDataIndex(record, column.dataIndex)

          if (column.render) {
            return column.render(rawValue, record, index)
          }

          const valueEnumText =
            rawValue !== undefined && rawValue !== null
              ? column.valueEnum?.[String(rawValue)]?.text
              : undefined

          return normalizeTextValue(valueEnumText ?? rawValue)
        }}
      </For>
    )
  }

  const totalPages = createMemo(() => {
    if (!paginationEnabled()) return 1
    return Math.max(1, Math.ceil((resolvedTotal() || 0) / pageSize()))
  })

  const isLoading = () => local.loading ?? internalLoading()

  return (
    <div data-slot="data-list" class={cx('flex flex-col gap-3', local.class)} {...rest}>
      <List
        variant={local.variant ?? 'outlined'}
        split={local.split ?? true}
        size={local.size}
        itemLayout={local.itemLayout}
      >
        <Show when={local.headerTitle || searchEnabled() || local.toolBarRender || local.tooltip}>
          <ListHeader>
            <div class="flex items-center gap-2">
              <Show when={local.headerTitle}>{local.headerTitle}</Show>
              <Show when={local.tooltip}>{local.tooltip}</Show>
            </div>

            <ListToolbar>
              <Show when={searchEnabled()}>
                <input
                  type="text"
                  value={keyword()}
                  onInput={event => {
                    setKeyword(event.currentTarget.value)
                    setCurrent(1)
                  }}
                  placeholder={searchConfig()?.placeholder ?? locale().searchPlaceholder}
                  class={cx(
                    'placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-52 border bg-transparent px-3 text-sm shadow-xs outline-none',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'rounded-component',
                  )}
                />
              </Show>

              <Show when={local.toolBarRender}>{local.toolBarRender?.(action)}</Show>

              <Button variant="ghost" size="sm" onClick={() => void action.reload(true)}>
                {locale().reload}
              </Button>
              <Button variant="outline" size="sm" onClick={() => void action.reset()}>
                {locale().reset}
              </Button>
            </ListToolbar>
          </ListHeader>
        </Show>

        <ListBody>
          <Show when={!isLoading()} fallback={<ListSkeleton rows={Math.min(pageSize(), 6)} />}>
            <Show
              when={pagedData().length > 0}
              fallback={<ListEmpty>{locale().emptyText}</ListEmpty>}
            >
              <For each={pagedData()}>
                {(record, indexAccessor) => {
                  const index = () => indexAccessor()
                  const rowKey = () => getRowKey(record, index())
                  const isSelected = () => resolvedSelectedKeys().includes(rowKey())
                  const isExpanded = () => resolvedExpandedKeys().includes(rowKey())

                  const defaultNode = (
                    <>
                      <ListItem
                        selected={isSelected()}
                        expanded={isExpanded()}
                        onClick={() => local.onItem?.(record, index())}
                      >
                        <Show when={expandableConfig()}>
                          <ListItemMedia>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label={isExpanded() ? locale().collapse : locale().expand}
                              onClick={(event: MouseEvent) => {
                                event.stopPropagation()
                                toggleExpand(rowKey())
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="size-4 transition-transform"
                                classList={{
                                  'rotate-90': isExpanded(),
                                }}
                              >
                                <path d="m9 6l6 6l-6 6" />
                              </svg>
                            </Button>
                          </ListItemMedia>
                        </Show>

                        <Show when={rowSelectionConfig()}>
                          <ListItemMedia>
                            <Checkbox
                              checked={isSelected()}
                              onChange={() => {
                                toggleSelect(rowKey())
                              }}
                              aria-label={`select-row-${rowKey()}`}
                            >
                              <CheckboxControl />
                            </Checkbox>
                          </ListItemMedia>
                        </Show>

                        <Show when={renderSlot(record, index(), 'avatar')}>
                          <ListItemMedia>{renderSlot(record, index(), 'avatar')}</ListItemMedia>
                        </Show>

                        <ListItemMain>
                          <Show when={renderSlot(record, index(), 'type')}>
                            <ListItemType>{renderSlot(record, index(), 'type')}</ListItemType>
                          </Show>

                          <Show when={renderSlot(record, index(), 'title')}>
                            <ListItemTitle>{renderSlot(record, index(), 'title')}</ListItemTitle>
                          </Show>

                          <Show when={renderSlot(record, index(), 'subTitle')}>
                            <ListItemSubTitle>
                              {renderSlot(record, index(), 'subTitle')}
                            </ListItemSubTitle>
                          </Show>

                          <Show when={renderSlot(record, index(), 'description')}>
                            <ListItemDescription>
                              {renderSlot(record, index(), 'description')}
                            </ListItemDescription>
                          </Show>

                          <Show when={renderSlot(record, index(), 'content')}>
                            <ListItemContent>
                              {renderSlot(record, index(), 'content')}
                            </ListItemContent>
                          </Show>

                          <Show
                            when={
                              local.expandable &&
                              expandableConfig() &&
                              isExpanded() &&
                              expandableConfig()?.expandedRowRender
                            }
                          >
                            <div class="pt-1">
                              {expandableConfig()?.expandedRowRender?.(record, index())}
                            </div>
                          </Show>
                        </ListItemMain>

                        <Show when={renderSlot(record, index(), 'aside')}>
                          <ListItemAside>{renderSlot(record, index(), 'aside')}</ListItemAside>
                        </Show>

                        <Show when={renderSlot(record, index(), 'actions')}>
                          <ListItemActions>
                            {renderSlot(record, index(), 'actions')}
                          </ListItemActions>
                        </Show>
                      </ListItem>
                    </>
                  )

                  if (local.itemRender) {
                    return local.itemRender(record, index(), defaultNode)
                  }

                  return defaultNode
                }}
              </For>
            </Show>
          </Show>
        </ListBody>
      </List>

      <Show when={paginationEnabled() && totalPages() > 1}>
        <div class="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current() <= 1}
            onClick={() => setCurrent(1)}
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={current() <= 1}
            onClick={() => setCurrent(Math.max(1, current() - 1))}
          >
            Prev
          </Button>
          <span class="text-muted-foreground px-1 text-sm">
            {current()} / {totalPages()}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={current() >= totalPages()}
            onClick={() => setCurrent(Math.min(totalPages(), current() + 1))}
          >
            Next
          </Button>
        </div>
      </Show>
    </div>
  )
}
