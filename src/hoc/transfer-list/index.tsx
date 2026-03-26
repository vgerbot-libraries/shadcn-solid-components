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
import { Button } from '@/components/button'
import { useLocale } from '@/components/config-provider'
import type { TransferListLocale } from '@/i18n/types'
import { cx } from '@/lib/cva'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================

export const enLocale: TransferListLocale = {
  sourceTitle: 'Available',
  targetTitle: 'Selected',
  searchPlaceholder: 'Search...',
  moveRight: 'Move right',
  moveAllRight: 'Move all right',
  moveLeft: 'Move left',
  moveAllLeft: 'Move all left',
  selected: (count, total) => `${count}/${total} selected`,
  noData: 'No items',
}

export const zhCNLocale: TransferListLocale = {
  sourceTitle: '可选',
  targetTitle: '已选',
  searchPlaceholder: '搜索…',
  moveRight: '移至右侧',
  moveAllRight: '全部移至右侧',
  moveLeft: '移至左侧',
  moveAllLeft: '全部移至左侧',
  selected: (count, total) => `${count}/${total} 已选`,
  noData: '暂无数据',
}

export const zhTWLocale: TransferListLocale = {
  sourceTitle: '可選',
  targetTitle: '已選',
  searchPlaceholder: '搜尋…',
  moveRight: '移至右側',
  moveAllRight: '全部移至右側',
  moveLeft: '移至左側',
  moveAllLeft: '全部移至左側',
  selected: (count, total) => `${count}/${total} 已選`,
  noData: '暫無資料',
}

export const jaLocale: TransferListLocale = {
  sourceTitle: '利用可能',
  targetTitle: '選択済み',
  searchPlaceholder: '検索…',
  moveRight: '右へ移動',
  moveAllRight: 'すべて右へ',
  moveLeft: '左へ移動',
  moveAllLeft: 'すべて左へ',
  selected: (count, total) => `${count}/${total} 選択済み`,
  noData: 'データなし',
}

// ============================================================================
// Types
// ============================================================================

export interface TransferItem {
  /** Unique key for the item. */
  key: string
  /** Display label. */
  label: string
  /** Whether this item is disabled (cannot be moved). */
  disabled?: boolean
  /** Optional description shown below the label. */
  description?: string
}

export interface TransferListProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** All available items in the source pool. */
  source: TransferItem[]
  /** Items currently in the target (selected). Uses keys. */
  target: string[]
  /** Called when the target list changes. */
  onChange: (targetKeys: string[]) => void
  /** Enable search in both panels. Defaults to `true`. */
  searchable?: boolean
  /** Custom titles for the two panels. */
  titles?: [string, string]
  /** Custom render function for each item. */
  renderItem?: (item: TransferItem) => JSX.Element
  /** Locale overrides. */
  locale?: Partial<TransferListLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function TransferPanel(props: {
  title: string
  items: TransferItem[]
  checkedKeys: Set<string>
  onToggle: (key: string) => void
  onToggleAll: () => void
  searchable: boolean
  searchPlaceholder: string
  renderItem?: (item: TransferItem) => JSX.Element
  selectedText: (count: number, total: number) => string
  noData: string
}) {
  const [search, setSearch] = createSignal('')

  const filtered = createMemo(() => {
    const q = search().toLowerCase().trim()
    if (!q) return props.items
    return props.items.filter(
      item => item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q),
    )
  })

  const enabledItems = () => filtered().filter(i => !i.disabled)
  const checkedCount = () => filtered().filter(i => props.checkedKeys.has(i.key)).length
  const allChecked = () =>
    enabledItems().length > 0 && enabledItems().every(i => props.checkedKeys.has(i.key))

  let headerCheckRef!: HTMLInputElement
  createEffect(() => {
    if (headerCheckRef) {
      headerCheckRef.indeterminate = checkedCount() > 0 && !allChecked()
    }
  })

  return (
    <div class="border-input flex min-h-[300px] flex-1 flex-col rounded-md border">
      {/* Header */}
      <div class="flex items-center gap-2 border-b px-3 py-2">
        <input
          ref={headerCheckRef!}
          type="checkbox"
          class="accent-primary size-4 rounded"
          checked={allChecked()}
          onChange={props.onToggleAll}
        />
        <span class="flex-1 text-sm font-medium">{props.title}</span>
        <span class="text-muted-foreground text-xs">
          {props.selectedText(checkedCount(), filtered().length)}
        </span>
      </div>

      {/* Search */}
      <Show when={props.searchable}>
        <div class="border-b px-3 py-2">
          <input
            type="text"
            class={cx(
              'placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-8 w-full border bg-transparent px-2.5 text-sm shadow-xs outline-none',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'rounded-md',
            )}
            placeholder={props.searchPlaceholder}
            value={search()}
            onInput={e => setSearch(e.currentTarget.value)}
          />
        </div>
      </Show>

      {/* List */}
      <div class="flex-1 overflow-y-auto p-1">
        <Show
          when={filtered().length > 0}
          fallback={
            <div class="text-muted-foreground flex h-full items-center justify-center text-sm">
              {props.noData}
            </div>
          }
        >
          <For each={filtered()}>
            {item => (
              <label
                class={cx(
                  'flex cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 hover:bg-accent',
                  item.disabled && 'pointer-events-none opacity-50',
                )}
              >
                <input
                  type="checkbox"
                  class="accent-primary mt-0.5 size-4 rounded"
                  checked={props.checkedKeys.has(item.key)}
                  disabled={item.disabled}
                  onChange={() => props.onToggle(item.key)}
                />
                <Show
                  when={props.renderItem}
                  fallback={
                    <div class="flex flex-col">
                      <span class="text-sm">{item.label}</span>
                      <Show when={item.description}>
                        <span class="text-muted-foreground text-xs">{item.description}</span>
                      </Show>
                    </div>
                  }
                >
                  {props.renderItem!(item)}
                </Show>
              </label>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A two-panel transfer list for moving items between "available" and "selected".
 *
 * @example
 * ```tsx
 * const items: TransferItem[] = [
 *   { key: '1', label: 'Admin' },
 *   { key: '2', label: 'Editor' },
 *   { key: '3', label: 'Viewer' },
 * ]
 * const [selected, setSelected] = createSignal<string[]>(['1'])
 *
 * <TransferList
 *   source={items}
 *   target={selected()}
 *   onChange={setSelected}
 * />
 * ```
 */
export function TransferList(props: TransferListProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'source',
    'target',
    'onChange',
    'searchable',
    'titles',
    'renderItem',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): TransferListLocale => ({
    ...defaultLocale,
    ...globalLocale.TransferList,
    ...local.locale,
  })
  const searchable = () => local.searchable !== false

  const targetSet = createMemo(() => new Set(local.target))
  const sourceItems = createMemo(() => local.source.filter(i => !targetSet().has(i.key)))
  const targetItems = createMemo(() => {
    const set = targetSet()
    return local.source.filter(i => set.has(i.key))
  })

  const [sourceChecked, setSourceChecked] = createSignal<Set<string>>(new Set())
  const [targetChecked, setTargetChecked] = createSignal<Set<string>>(new Set())

  const toggleKey = (set: Set<string>, key: string): Set<string> => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  }

  const moveRight = () => {
    const keys = sourceChecked()
    if (keys.size === 0) return
    local.onChange([...local.target, ...keys])
    setSourceChecked(new Set<string>())
  }

  const moveAllRight = () => {
    const allKeys = sourceItems()
      .filter(i => !i.disabled)
      .map(i => i.key)
    local.onChange([...local.target, ...allKeys])
    setSourceChecked(new Set<string>())
  }

  const moveLeft = () => {
    const keys = targetChecked()
    if (keys.size === 0) return
    local.onChange(local.target.filter(k => !keys.has(k)))
    setTargetChecked(new Set<string>())
  }

  const moveAllLeft = () => {
    const removable = targetItems()
      .filter(i => !i.disabled)
      .map(i => i.key)
    const removableSet = new Set(removable)
    local.onChange(local.target.filter(k => !removableSet.has(k)))
    setTargetChecked(new Set<string>())
  }

  return (
    <div data-slot="transfer-list" class={cx('flex items-stretch gap-3', local.class)} {...rest}>
      {/* Source panel */}
      <TransferPanel
        title={local.titles?.[0] ?? locale().sourceTitle}
        items={sourceItems()}
        checkedKeys={sourceChecked()}
        onToggle={key => setSourceChecked(s => toggleKey(s, key))}
        onToggleAll={() => {
          const enabled = sourceItems().filter(i => !i.disabled)
          const allChecked = enabled.every(i => sourceChecked().has(i.key))
          setSourceChecked(allChecked ? new Set<string>() : new Set(enabled.map(i => i.key)))
        }}
        searchable={searchable()}
        searchPlaceholder={locale().searchPlaceholder}
        renderItem={local.renderItem}
        selectedText={locale().selected}
        noData={locale().noData}
      />

      {/* Action buttons */}
      <div class="flex flex-col items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          disabled={sourceChecked().size === 0}
          onClick={moveRight}
          aria-label={locale().moveRight}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          onClick={moveAllRight}
          aria-label={locale().moveAllRight}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m6 17 5-5-5-5m7 10 5-5-5-5"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          disabled={targetChecked().size === 0}
          onClick={moveLeft}
          aria-label={locale().moveLeft}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 18-6-6 6-6"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          onClick={moveAllLeft}
          aria-label={locale().moveAllLeft}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m18 17-5-5 5-5M11 17l-5-5 5-5"
            />
          </svg>
        </Button>
      </div>

      {/* Target panel */}
      <TransferPanel
        title={local.titles?.[1] ?? locale().targetTitle}
        items={targetItems()}
        checkedKeys={targetChecked()}
        onToggle={key => setTargetChecked(s => toggleKey(s, key))}
        onToggleAll={() => {
          const enabled = targetItems().filter(i => !i.disabled)
          const allChecked = enabled.every(i => targetChecked().has(i.key))
          setTargetChecked(allChecked ? new Set<string>() : new Set(enabled.map(i => i.key)))
        }}
        searchable={searchable()}
        searchPlaceholder={locale().searchPlaceholder}
        renderItem={local.renderItem}
        selectedText={locale().selected}
        noData={locale().noData}
      />
    </div>
  )
}
