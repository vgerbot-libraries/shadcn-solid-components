import { type ComponentProps, createMemo, For, type JSX, Show, splitProps } from 'solid-js'
import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import type { FilterBuilderLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'in'
  | 'not_in'

export type FilterFieldType = 'text' | 'number' | 'select' | 'date'

export interface FilterFieldOption {
  label: string
  value: string
}

export interface FilterFieldDefinition {
  /** Unique field key (matches your data model). */
  key: string
  /** Display label for the field. */
  label: string
  /** Field type — determines available operators and input rendering. */
  type: FilterFieldType
  /** Available operators for this field. If omitted, defaults are inferred from `type`. */
  operators?: FilterOperator[]
  /** Options for `select` type fields. */
  options?: FilterFieldOption[]
}

export interface FilterRule {
  /** The field key. */
  field: string
  /** The operator. */
  operator: FilterOperator
  /** The comparison value. */
  value: string
}

export interface FilterBuilderProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** Field definitions configuring available filter fields. */
  fields: FilterFieldDefinition[]
  /** Current filter rules (controlled). */
  value: FilterRule[]
  /** Called when the filter rules change. */
  onChange: (rules: FilterRule[]) => void
  /** Max number of filter rules. */
  maxRules?: number
  /** Locale overrides. */
  locale?: Partial<FilterBuilderLocale>
}

// ============================================================================
// Helpers
// ============================================================================

const defaultOperators: Record<FilterFieldType, FilterOperator[]> = {
  text: ['contains', 'eq', 'neq', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
  select: ['eq', 'neq', 'in', 'not_in'],
  date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
}

const operatorLabels: Record<FilterOperator, string> = {
  eq: '=',
  neq: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  contains: 'contains',
  not_contains: 'not contains',
  starts_with: 'starts with',
  ends_with: 'ends with',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  in: 'in',
  not_in: 'not in',
}

const noValueOperators: Set<FilterOperator> = new Set(['is_empty', 'is_not_empty'])

function selectClass(): string {
  return cx(
    'border-input bg-background h-8 rounded-md border px-2.5 text-sm shadow-xs outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  )
}

function inputClass(): string {
  return cx(
    'placeholder:text-muted-foreground dark:bg-input/30 border-input h-8 border bg-transparent px-2.5 text-sm shadow-xs outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'rounded-md',
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A composable filter rule builder: field + operator + value rows
 * with add/remove functionality.
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = createSignal<FilterRule[]>([])
 *
 * <FilterBuilder
 *   fields={[
 *     { key: 'name', label: 'Name', type: 'text' },
 *     { key: 'age', label: 'Age', type: 'number' },
 *     { key: 'status', label: 'Status', type: 'select', options: [
 *       { label: 'Active', value: 'active' },
 *       { label: 'Inactive', value: 'inactive' },
 *     ]},
 *   ]}
 *   value={filters()}
 *   onChange={setFilters}
 * />
 * ```
 */
export function FilterBuilder(props: FilterBuilderProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'fields',
    'value',
    'onChange',
    'maxRules',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): FilterBuilderLocale => ({
    ...defaultLocale,
    ...globalLocale.FilterBuilder,
    ...local.locale,
  })
  const atMax = () => local.maxRules !== undefined && local.value.length >= local.maxRules

  const fieldMap = createMemo(() => {
    const map = new Map<string, FilterFieldDefinition>()
    for (const f of local.fields) map.set(f.key, f)
    return map
  })

  const getOperators = (fieldKey: string): FilterOperator[] => {
    const field = fieldMap().get(fieldKey)
    if (!field) return []
    return field.operators ?? defaultOperators[field.type] ?? []
  }

  const addRule = () => {
    if (atMax()) return
    const firstField = local.fields[0]
    if (!firstField) return
    const ops = getOperators(firstField.key)
    local.onChange([...local.value, { field: firstField.key, operator: ops[0] ?? 'eq', value: '' }])
  }

  const removeRule = (index: number) => {
    const next = [...local.value]
    next.splice(index, 1)
    local.onChange(next)
  }

  const updateRule = (index: number, patch: Partial<FilterRule>) => {
    const next = [...local.value]
    const current = next[index]
    if (!current) return
    const updated = { ...current, ...patch }

    if (patch.field) {
      const ops = getOperators(patch.field)
      if (!ops.includes(updated.operator)) {
        updated.operator = ops[0] ?? 'eq'
      }
      updated.value = ''
    }

    next[index] = updated
    local.onChange(next)
  }

  const reset = () => local.onChange([])

  return (
    <div data-slot="filter-builder" class={cx('flex flex-col gap-3', local.class)} {...rest}>
      <Show
        when={local.fields.length > 0}
        fallback={<p class="text-muted-foreground text-sm">{locale().noFields}</p>}
      >
        {/* Filter rows */}
        <For each={local.value}>
          {(rule, index) => {
            const field = () => fieldMap().get(rule.field)
            const operators = () => getOperators(rule.field)
            const needsValue = () => !noValueOperators.has(rule.operator)

            return (
              <div class="flex flex-wrap items-center gap-2">
                {/* Label: Where / And */}
                <Badge variant="outline" class="shrink-0 font-normal">
                  {index() === 0 ? locale().where : locale().and}
                </Badge>

                {/* Field select */}
                <select
                  class={selectClass()}
                  value={rule.field}
                  onChange={e => updateRule(index(), { field: e.currentTarget.value })}
                >
                  <For each={local.fields}>{f => <option value={f.key}>{f.label}</option>}</For>
                </select>

                {/* Operator select */}
                <select
                  class={selectClass()}
                  value={rule.operator}
                  onChange={e =>
                    updateRule(index(), { operator: e.currentTarget.value as FilterOperator })
                  }
                >
                  <For each={operators()}>
                    {op => <option value={op}>{operatorLabels[op]}</option>}
                  </For>
                </select>

                {/* Value input */}
                <Show when={needsValue()}>
                  <Show
                    when={field()?.type === 'select' && field()?.options}
                    fallback={
                      <input
                        type={
                          field()?.type === 'number'
                            ? 'number'
                            : field()?.type === 'date'
                              ? 'date'
                              : 'text'
                        }
                        class={inputClass()}
                        placeholder={locale().enterValue}
                        value={rule.value}
                        onInput={e => updateRule(index(), { value: e.currentTarget.value })}
                      />
                    }
                  >
                    <select
                      class={selectClass()}
                      value={rule.value}
                      onChange={e => updateRule(index(), { value: e.currentTarget.value })}
                    >
                      <option value="">{locale().selectOperator}</option>
                      <For each={field()!.options!}>
                        {opt => <option value={opt.value}>{opt.label}</option>}
                      </For>
                    </select>
                  </Show>
                </Show>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-destructive h-8"
                  onClick={() => removeRule(index())}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 6L6 18M6 6l12 12"
                    />
                  </svg>
                  <span class="sr-only">{locale().removeRule}</span>
                </Button>
              </div>
            )
          }}
        </For>

        {/* Actions */}
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={atMax()} onClick={addRule}>
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 size-4" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m-7-7h14"
              />
            </svg>
            {locale().addRule}
          </Button>
          <Show when={local.value.length > 0}>
            <Button variant="ghost" size="sm" onClick={reset}>
              {locale().reset}
            </Button>
          </Show>
        </div>
      </Show>
    </div>
  )
}
