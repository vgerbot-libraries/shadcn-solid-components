import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn-solid-components/components/accordion'
import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
} from 'solid-js'
import type { FaqSectionLocale } from 'shadcn-solid-components/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface FaqItem {
  /** Unique FAQ item identifier. */
  id?: string
  /** FAQ question text. */
  question: string
  /** FAQ answer text or custom element. */
  answer: string | JSX.Element
  /** Optional category identifier for filtering/grouping. */
  category?: string
}

export interface FaqCategory {
  /** Unique category identifier. */
  id: string
  /** Display label for category. */
  label: string
  /** Optional icon element for category card. */
  icon?: JSX.Element
}

export interface FaqSectionProps extends ComponentProps<'section'> {
  /** FAQ items to render. */
  items: FaqItem[]
  /** Whether search input is shown. Defaults to `true`. */
  searchable?: boolean
  /** Search input placeholder. Falls back to locale text. */
  searchPlaceholder?: string
  /** Optional category filters shown as selectable chips/cards. */
  categories?: FaqCategory[]
  /** Initial selected category. Defaults to `'all'`. */
  defaultCategory?: string
  /** Empty state title override. */
  emptyTitle?: string
  /** Empty state description override. */
  emptyDescription?: string
  /** Locale overrides. */
  locale?: Partial<FaqSectionLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * FAQ section component with optional search, category filters, and accordion answers.
 *
 * @example
 * ```tsx
 * <FaqSection
 *   categories={[
 *     { id: 'general', label: 'General' },
 *     { id: 'billing', label: 'Billing' },
 *   ]}
 *   items={[
 *     { id: 'q1', question: 'What is this?', answer: 'A reusable FAQ section.', category: 'general' },
 *     { id: 'q2', question: 'Can I cancel anytime?', answer: 'Yes.', category: 'billing' },
 *   ]}
 * />
 * ```
 */
export function FaqSection(props: FaqSectionProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'items',
    'searchable',
    'searchPlaceholder',
    'categories',
    'defaultCategory',
    'emptyTitle',
    'emptyDescription',
    'locale',
  ])
  const globalLocale = useLocale()
  const locale = (): FaqSectionLocale => ({
    ...defaultLocale,
    ...globalLocale.FaqSection,
    ...props.locale,
  })

  const [query, setQuery] = createSignal('')
  const [selectedCategory, setSelectedCategory] = createSignal(local.defaultCategory ?? 'all')

  const normalizedQuery = createMemo(() => query().trim().toLowerCase())

  const filteredItems = createMemo(() => {
    const q = normalizedQuery()
    const category = selectedCategory()

    return local.items.filter((item) => {
      const inCategory = category === 'all' || item.category === category
      if (!inCategory) return false

      if (!q) return true
      const question = item.question.toLowerCase()
      const answer = typeof item.answer === 'string' ? item.answer.toLowerCase() : ''
      const itemCategory = item.category?.toLowerCase() ?? ''
      return question.includes(q) || answer.includes(q) || itemCategory.includes(q)
    })
  })

  const categoryCount = (categoryId: string) =>
    local.items.filter((item) => categoryId === 'all' || item.category === categoryId).length

  return (
    <section data-slot="faq-section" class={cx('flex flex-col gap-6', local.class)} {...rest}>
      <Show when={local.searchable ?? true}>
        <div data-slot="faq-search" class="mx-auto w-full max-w-xl">
          <TextField>
            <TextFieldInput
              value={query()}
              onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) =>
                setQuery(event.currentTarget.value)}
              placeholder={local.searchPlaceholder ?? locale().searchPlaceholder}
              aria-label={local.searchPlaceholder ?? locale().searchPlaceholder}
            />
          </TextField>
        </div>
      </Show>

      <Show when={local.categories?.length}>
        <div data-slot="faq-categories" class="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedCategory() === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            class="rounded-full"
          >
            {locale().allCategories}
            <Badge variant="secondary" class="ml-2">
              {categoryCount('all')}
            </Badge>
          </Button>

          <For each={local.categories}>
            {(category) => (
              <Button
                type="button"
                variant={selectedCategory() === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                class="rounded-full"
              >
                <Show when={category.icon}>{category.icon}</Show>
                {category.label}
                <Badge variant="secondary" class="ml-2">
                  {categoryCount(category.id)}
                </Badge>
              </Button>
            )}
          </For>
        </div>
      </Show>

      <Show
        when={filteredItems().length > 0}
        fallback={
          <div
            data-slot="faq-empty"
            class="border-border bg-card text-muted-foreground rounded-lg border border-dashed p-8 text-center"
          >
            <p class="text-foreground text-base font-medium">{local.emptyTitle ?? locale().emptyTitle}</p>
            <p class="mt-2 text-sm">{local.emptyDescription ?? locale().emptyDescription}</p>
          </div>
        }
      >
        <Accordion data-slot="faq-accordion" multiple class="w-full">
          <For each={filteredItems()}>
            {(item, index) => (
              <AccordionItem value={item.id ?? `faq-item-${index()}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <Show when={typeof item.answer === 'string'} fallback={item.answer}>
                    <p class="text-muted-foreground leading-relaxed">{item.answer as string}</p>
                  </Show>
                </AccordionContent>
              </AccordionItem>
            )}
          </For>
        </Accordion>
      </Show>
    </section>
  )
}
