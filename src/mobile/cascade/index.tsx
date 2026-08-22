import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { IconChevronRight } from 'shadcn-solid-components/components/icons'
import { ScrollArea } from 'shadcn-solid-components/components/scroll-area'
import type { CascadeLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createMemo,
  createSignal,
  For,
  type JSX,
  mergeProps,
  Show,
  splitProps,
  untrack,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type CascadeValue = string | number

export interface CascadeOption {
  value: CascadeValue
  label: JSX.Element
  children?: CascadeOption[]
}

export interface CascadeProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  name?: string
  value?: CascadeValue[]
  defaultValue?: CascadeValue[]
  options?: CascadeOption[]
  changeOnSelect?: boolean
  prompt?: (levelIndex: number) => string
  onChange?: (value: CascadeValue[], selectedOptions: CascadeOption[], isLast: boolean) => void
}

// ============================================================================
// Helpers
// ============================================================================

const isLeaf = (option?: CascadeOption) =>
  !Array.isArray(option?.children) || option.children.length === 0

const getSelectedOptions = (value: CascadeValue[], options: CascadeOption[]) => {
  const selected: CascadeOption[] = []
  let level = options

  for (const item of value) {
    const match = level.find(option => option.value === item)
    if (!match) {
      break
    }

    selected.push(match)
    level = match.children ?? []
  }

  return selected
}

const getLevelOptions = (selected: CascadeOption[], options: CascadeOption[]) => {
  if (selected.length === 0) {
    return options
  }

  const last = selected[selected.length - 1]
  if (last && !isLeaf(last)) {
    return last.children ?? []
  }

  if (selected.length === 1) {
    return options
  }

  return selected[selected.length - 2]?.children ?? options
}

// ============================================================================
// Component
// ============================================================================

export const Cascade = (props: CascadeProps) => {
  const merge = mergeProps(
    {
      options: [] as CascadeOption[],
      defaultValue: [] as CascadeValue[],
      changeOnSelect: false,
    },
    props,
  )
  const [local, rest] = splitProps(merge, [
    'class',
    'name',
    'value',
    'defaultValue',
    'options',
    'changeOnSelect',
    'prompt',
    'onChange',
  ])
  const componentClass = useComponentClass(ComponentName.Cascade, props)

  const locale = (): CascadeLocale => ({
    ...defaultLocale,
    ...useLocale().Cascade,
  })

  const isControlled = () => local.value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = createSignal<CascadeValue[]>(
    untrack(() => local.defaultValue ?? []),
  )
  const [rechooseIndex, setRechooseIndex] = createSignal<number>()

  const currentValue = createMemo(() =>
    isControlled() ? (local.value ?? []) : uncontrolledValue(),
  )
  const selectedOptions = createMemo(() => getSelectedOptions(currentValue(), local.options))
  const levelOptions = createMemo(() => {
    const selected = selectedOptions()
    const replaceAt = rechooseIndex()
    if (replaceAt !== undefined) {
      if (replaceAt === 0) {
        return local.options
      }

      return selected[replaceAt - 1]?.children ?? local.options
    }

    return getLevelOptions(selected, local.options)
  })
  const title = createMemo(() => locale().selectName.replaceAll('{name}', local.name ?? ''))

  const commit = (nextValue: CascadeValue[], nextSelected: CascadeOption[], isLast: boolean) => {
    if (!isControlled()) {
      setUncontrolledValue(nextValue)
    }

    if (local.changeOnSelect || isLast) {
      local.onChange?.(nextValue, nextSelected, isLast)
    }
  }

  const handleSelect = (option: CascadeOption) => {
    const selected = selectedOptions()
    const last = selected[selected.length - 1]
    const replaceAt = rechooseIndex()
    setRechooseIndex(undefined)

    const nextSelected =
      replaceAt !== undefined
        ? [...selected.slice(0, replaceAt), option]
        : selected.length > 0 && isLeaf(last)
          ? [...selected.slice(0, -1), option]
          : [...selected, option]
    const nextValue = nextSelected.map(item => item.value)

    commit(nextValue, nextSelected, isLeaf(option))
  }

  const handleRechoose = (index: number) => {
    const nextSelected = selectedOptions().slice(0, index + 1)
    const nextValue = nextSelected.map(item => item.value)
    setRechooseIndex(index)
    commit(nextValue, nextSelected, isLeaf(nextSelected[nextSelected.length - 1]))
  }

  return (
    <div
      data-slot="cascade"
      class={cx('bg-muted/40 flex h-full min-h-0 flex-col', componentClass, local.class)}
      {...rest}
    >
      <div data-slot="cascade-selected" class="bg-background">
        <For
          each={selectedOptions().slice(0, (rechooseIndex() ?? selectedOptions().length - 1) + 1)}
        >
          {(option, index) => (
            <button
              type="button"
              data-slot="cascade-step"
              class="relative flex h-12 w-full cursor-pointer items-center justify-between pl-11 pr-4 text-left"
              onClick={() => handleRechoose(index())}
            >
              <span
                data-slot="cascade-step-dot"
                class="bg-primary pointer-events-none absolute top-1/2 left-5 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              />
              <Show when={index() > 0}>
                <span
                  data-slot="cascade-step-line"
                  class="bg-primary pointer-events-none absolute bottom-1/2 left-5 h-12 w-px -translate-x-1/2"
                />
              </Show>
              <span data-slot="cascade-step-label" class="text-foreground truncate text-[15px]">
                {option.label}
              </span>
              <span
                data-slot="cascade-step-right"
                class="text-muted-foreground ml-3 flex shrink-0 items-center gap-1"
              >
                <Show when={local.prompt?.(index())}>
                  {hint => (
                    <span data-slot="cascade-step-prompt" class="text-[15px]">
                      {hint()}
                    </span>
                  )}
                </Show>
                <IconChevronRight class="size-3" />
              </span>
            </button>
          )}
        </For>
      </div>

      <ScrollArea data-slot="cascade-options" class="min-h-0 flex-1 px-4">
        <div data-slot="cascade-title" class="text-muted-foreground pt-4 pb-1 text-xs">
          {title()}
        </div>
        <For each={levelOptions()}>
          {option => (
            <button
              type="button"
              data-slot="cascade-option"
              class="text-foreground flex min-h-11 w-full cursor-pointer items-center py-3 text-left text-[15px]"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          )}
        </For>
      </ScrollArea>
    </div>
  )
}
