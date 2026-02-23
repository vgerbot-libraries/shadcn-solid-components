import { useLocale } from '@/components/config-provider'
import type { TagInputLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'
import { Badge } from '@/components/badge'
import { cx } from '@/lib/cva'

// ============================================================================


export const enLocale: TagInputLocale = {
  placeholder: 'Add a tag...',
  removeTag: 'Remove',
  maxReached: max => `Maximum of ${max} tags reached`,
}

export const zhCNLocale: TagInputLocale = {
  placeholder: '添加标签…',
  removeTag: '移除',
  maxReached: max => `最多 ${max} 个标签`,
}

export const zhTWLocale: TagInputLocale = {
  placeholder: '新增標籤…',
  removeTag: '移除',
  maxReached: max => `最多 ${max} 個標籤`,
}

export const jaLocale: TagInputLocale = {
  placeholder: 'タグを追加…',
  removeTag: '削除',
  maxReached: max => `最大 ${max} タグ`,
}

// ============================================================================
// Types
// ============================================================================

export interface TagInputProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** Current tag values (controlled). */
  value?: string[]
  /** Called when the tag list changes. */
  onChange?: (tags: string[]) => void
  /** Autocomplete suggestions shown while typing. */
  suggestions?: string[]
  /** Max number of tags. */
  max?: number
  /** Input placeholder. */
  placeholder?: string
  /** Allow creating tags not in the suggestion list. Defaults to `true`. */
  allowCreate?: boolean
  /** Validate a tag before adding. Return `true` to accept. */
  validate?: (tag: string) => boolean
  /** Disabled state. */
  disabled?: boolean
  /** Locale overrides. */
  locale?: Partial<TagInputLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A text input that creates tags/chips, with optional autocomplete suggestions.
 *
 * @example
 * ```tsx
 * const [tags, setTags] = createSignal(['react', 'solid'])
 *
 * <TagInput
 *   value={tags()}
 *   onChange={setTags}
 *   suggestions={['react', 'solid', 'vue', 'svelte']}
 *   max={5}
 * />
 * ```
 */
export function TagInput(props: TagInputProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'value',
    'onChange',
    'suggestions',
    'max',
    'placeholder',
    'allowCreate',
    'validate',
    'disabled',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): TagInputLocale => ({ ...defaultLocale, ...globalLocale.TagInput, ...local.locale })
  const allowCreate = () => local.allowCreate !== false
  const tags = () => local.value ?? []
  const atMax = () => local.max !== undefined && tags().length >= local.max

  const [inputValue, setInputValue] = createSignal('')
  const [showSuggestions, setShowSuggestions] = createSignal(false)
  const [focusedIndex, setFocusedIndex] = createSignal(-1)

  let inputRef!: HTMLInputElement

  const filteredSuggestions = () => {
    if (!local.suggestions) return []
    const query = inputValue().toLowerCase().trim()
    if (!query) return []
    return local.suggestions.filter(s => s.toLowerCase().includes(query) && !tags().includes(s))
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (tags().includes(trimmed)) return
    if (atMax()) return
    if (local.validate && !local.validate(trimmed)) return
    if (!allowCreate() && local.suggestions && !local.suggestions.includes(trimmed)) return

    local.onChange?.([...tags(), trimmed])
    setInputValue('')
    setShowSuggestions(false)
    setFocusedIndex(-1)
  }

  const removeTag = (index: number) => {
    const next = [...tags()]
    next.splice(index, 1)
    local.onChange?.(next)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const suggestions = filteredSuggestions()

    if (e.key === 'Enter') {
      e.preventDefault()
      const focused = suggestions[focusedIndex()]
      if (focusedIndex() >= 0 && focused) {
        addTag(focused)
      } else {
        addTag(inputValue())
      }
      return
    }

    if (e.key === 'Backspace' && !inputValue() && tags().length > 0) {
      removeTag(tags().length - 1)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(i => Math.min(i + 1, suggestions.length - 1))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(i => Math.max(i - 1, -1))
      return
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setFocusedIndex(-1)
    }
  }

  return (
    <div data-slot="tag-input" class={cx('relative', local.class)} {...rest}>
      <div
        class={cx(
          'border-input bg-background flex flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          local.disabled && 'pointer-events-none opacity-50',
        )}
        onClick={() => inputRef?.focus()}
      >
        <For each={tags()}>
          {(tag, index) => (
            <Badge variant="secondary" class="gap-1 pr-1">
              {tag}
              <button
                type="button"
                class="hover:bg-muted rounded-sm p-0.5"
                onClick={e => {
                  e.stopPropagation()
                  removeTag(index())
                }}
                aria-label={`${locale().removeTag} ${tag}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 6L6 18M6 6l12 12"
                  />
                </svg>
              </button>
            </Badge>
          )}
        </For>

        <input
          ref={inputRef!}
          type="text"
          class="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent text-sm outline-none"
          placeholder={
            atMax() ? locale().maxReached(local.max!) : (local.placeholder ?? locale().placeholder)
          }
          value={inputValue()}
          disabled={local.disabled || atMax()}
          onInput={e => {
            setInputValue(e.currentTarget.value)
            setShowSuggestions(true)
            setFocusedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200)
          }}
        />
      </div>

      {/* Suggestions dropdown */}
      <Show when={showSuggestions() && filteredSuggestions().length > 0}>
        <div
          class={cx(
            'bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border p-1 shadow-md',
          )}
        >
          <For each={filteredSuggestions()}>
            {(suggestion, index) => (
              <button
                type="button"
                class={cx(
                  'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                  focusedIndex() === index()
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground',
                )}
                onMouseDown={e => {
                  e.preventDefault()
                  addTag(suggestion)
                }}
                onMouseEnter={() => setFocusedIndex(index())}
              >
                {suggestion}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
