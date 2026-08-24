import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTrigger,
} from 'shadcn-solid-components/components/drawer'
import type { PickerLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  mergeProps,
  on,
  Show,
  splitProps,
  untrack,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type PickerValue = number | number[]
export type PickerOption = string | Record<string, unknown>

export interface PickerProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: PickerValue
  defaultValue?: PickerValue
  range?: PickerOption[] | PickerOption[][]
  rangeKey?: string
  disabled?: boolean
  placeholder?: string
  textAlign?: 'left' | 'right' | 'center'
  onChange?: (value: PickerValue) => void
}

// ============================================================================
// Helpers
// ============================================================================

const ROW_HEIGHT = 44

const isMultiRange = (range?: PickerOption[] | PickerOption[][]): range is PickerOption[][] =>
  Array.isArray(range?.[0])

const optionLabel = (option: PickerOption | undefined, rangeKey: string) => {
  if (option === undefined) {
    return ''
  }

  return typeof option === 'string' ? option : String(option[rangeKey] ?? '')
}

const columnsFromRange = (range?: PickerOption[] | PickerOption[][]): PickerOption[][] => {
  if (!range || range.length === 0) {
    return [[]]
  }

  return isMultiRange(range) ? range : [range]
}

const normalizeValue = (value: PickerValue | undefined, columnCount: number): number[] => {
  if (columnCount <= 1) {
    const index = Array.isArray(value) ? (value[0] ?? 0) : (value ?? 0)
    return [index]
  }

  if (Array.isArray(value)) {
    return Array.from({ length: columnCount }, (_, index) => value[index] ?? 0)
  }

  return Array.from({ length: columnCount }, () => 0)
}

const toCommittedValue = (indices: number[], multi: boolean): PickerValue =>
  multi ? [...indices] : (indices[0] ?? 0)

const clampIndex = (index: number, length: number) => {
  if (length <= 0) {
    return 0
  }

  return Math.min(Math.max(index, 0), length - 1)
}

const selectedLabels = (columns: PickerOption[][], indices: number[], rangeKey: string) =>
  columns
    .map((column, index) => optionLabel(column[indices[index] ?? 0], rangeKey))
    .filter(Boolean)
    .join(' ')

// ============================================================================
// Column
// ============================================================================

const PickerColumn = (props: {
  options: PickerOption[]
  index: number
  rangeKey: string
  onIndexChange: (index: number) => void
}) => {
  let viewport: HTMLDivElement | undefined
  let frame = 0
  let settleTimer = 0

  const scrollToIndex = (index: number, behavior: ScrollBehavior) => {
    viewport?.scrollTo({ top: clampIndex(index, props.options.length) * ROW_HEIGHT, behavior })
  }

  const snapFromScroll = () => {
    if (!viewport) {
      return
    }

    const next = clampIndex(Math.round(viewport.scrollTop / ROW_HEIGHT), props.options.length)
    if (next !== props.index) {
      props.onIndexChange(next)
    }

    scrollToIndex(next, 'smooth')
  }

  const handleScroll = () => {
    if (frame) {
      cancelAnimationFrame(frame)
    }

    frame = requestAnimationFrame(() => {
      if (!viewport) {
        return
      }

      const next = clampIndex(Math.round(viewport.scrollTop / ROW_HEIGHT), props.options.length)
      if (next !== props.index) {
        props.onIndexChange(next)
      }
    })

    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(snapFromScroll, 80)
  }

  createEffect(
    on(
      () => [props.index, props.options.length] as const,
      ([index]) => {
        scrollToIndex(index, 'auto')
      },
    ),
  )

  return (
    <div data-slot="picker-column" class="relative min-w-0 flex-1">
      <div
        ref={viewport}
        class="h-[220px] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ 'scroll-snap-type': 'y mandatory' }}
        onScroll={handleScroll}
      >
        <div class="h-22 shrink-0" aria-hidden="true" />
        <For each={props.options}>
          {(option, index) => (
            <button
              type="button"
              data-slot="picker-option"
              class={cx(
                'flex h-11 w-full shrink-0 snap-center items-center justify-center px-2 text-center text-[15px]',
                index() === props.index ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
              onClick={() => {
                props.onIndexChange(index())
                scrollToIndex(index(), 'smooth')
              }}
            >
              {optionLabel(option, props.rangeKey)}
            </button>
          )}
        </For>
        <div class="h-22 shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

export const Picker = (props: PickerProps) => {
  const merge = mergeProps(
    {
      range: [] as PickerOption[],
      rangeKey: 'text',
      textAlign: 'left' as const,
    },
    props,
  )
  const [local, rest] = splitProps(merge, [
    'class',
    'value',
    'defaultValue',
    'range',
    'rangeKey',
    'disabled',
    'placeholder',
    'textAlign',
    'onChange',
    'children',
  ])
  const componentClass = useComponentClass(ComponentName.Picker, props)

  const locale = (): PickerLocale => ({
    ...defaultLocale,
    ...useLocale().Picker,
  })

  const columns = createMemo(() => columnsFromRange(local.range))
  const multi = createMemo(() => isMultiRange(local.range))
  const isControlled = () => local.value !== undefined

  const [uncontrolledValue, setUncontrolledValue] = createSignal<PickerValue>(
    untrack(() => {
      const columnCount = columnsFromRange(local.range).length
      return toCommittedValue(
        normalizeValue(local.defaultValue, columnCount),
        isMultiRange(local.range),
      )
    }),
  )

  const committedIndices = createMemo(() =>
    normalizeValue(isControlled() ? local.value : uncontrolledValue(), columns().length),
  )

  const [open, setOpen] = createSignal(false)
  const [draft, setDraft] = createSignal<number[]>(untrack(committedIndices))

  const triggerText = createMemo(() => {
    if (local.children !== undefined) {
      return undefined
    }

    const labels = selectedLabels(columns(), committedIndices(), local.rangeKey)
    return labels || local.placeholder || locale().placeholder
  })

  const seedDraft = () => {
    setDraft(committedIndices())
  }

  const handleOpenChange = (next: boolean) => {
    if (local.disabled && next) {
      return
    }

    if (next) {
      seedDraft()
    }

    setOpen(next)
  }

  const handleConfirm = () => {
    const next = toCommittedValue(draft(), multi())
    if (!isControlled()) {
      setUncontrolledValue(next)
    }

    local.onChange?.(next)
    setOpen(false)
  }

  return (
    <div data-slot="picker" class={cx(componentClass, local.class)} {...rest}>
      <Drawer open={open()} onOpenChange={handleOpenChange} side="bottom">
        <DrawerTrigger
          data-slot="picker-trigger"
          disabled={local.disabled}
          class={cx(
            'text-foreground flex min-h-11 w-full cursor-pointer items-center text-[15px]',
            local.textAlign === 'right' && 'justify-end text-right',
            local.textAlign === 'center' && 'justify-center text-center',
            local.textAlign === 'left' && 'justify-start text-left',
            local.disabled && 'pointer-events-none opacity-50',
            !selectedLabels(columns(), committedIndices(), local.rangeKey) &&
              local.children === undefined &&
              'text-muted-foreground',
          )}
        >
          <Show when={local.children} fallback={triggerText()}>
            {local.children}
          </Show>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerContent class="overflow-hidden">
            <DrawerHeader
              data-slot="picker-toolbar"
              class="flex flex-row items-center justify-between p-0"
            >
              <DrawerClose
                data-slot="picker-cancel"
                class="text-muted-foreground h-11 cursor-pointer px-3 text-[15px] font-medium"
              >
                {locale().cancel}
              </DrawerClose>
              <button
                type="button"
                data-slot="picker-confirm"
                class="text-primary h-11 cursor-pointer px-3 text-[15px] font-medium"
                onClick={handleConfirm}
              >
                {locale().confirm}
              </button>
            </DrawerHeader>

            <DrawerFooter class="relative mt-0 p-0">
              <div class="relative flex h-[220px]">
                <For each={columns()}>
                  {(column, columnIndex) => (
                    <PickerColumn
                      options={column}
                      index={draft()[columnIndex()] ?? 0}
                      rangeKey={local.rangeKey}
                      onIndexChange={index => {
                        setDraft(current => {
                          const next = [...current]
                          next[columnIndex()] = index
                          return next
                        })
                      }}
                    />
                  )}
                </For>
                <div class="pointer-events-none absolute inset-0">
                  <div class="from-background/90 h-22 bg-linear-to-b to-transparent" />
                  <div class="bg-primary/8 h-11" />
                  <div class="from-background/90 h-22 bg-linear-to-t to-transparent" />
                </div>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  )
}
