import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import { Card, CardContent, CardFooter, CardHeader } from 'shadcn-solid-components/components/card'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { Separator } from 'shadcn-solid-components/components/separator'
import type { PricingTableLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface PricingFeature {
  /** Feature description text. */
  text: string
  /** Whether this feature is included in the plan. */
  included: boolean
}

export interface PricingPlan {
  /** Plan name (e.g. "Free", "Pro"). */
  name: string
  /** Short description of the plan. */
  description?: string
  /** Monthly price (numeric value). */
  priceMonthly: number
  /** Yearly price (numeric value). */
  priceYearly: number
  /** List of features with included/excluded status. */
  features: PricingFeature[]
  /** Mark this plan as the recommended/popular choice. */
  isPopular?: boolean
  /** CTA button text. */
  cta: string
  /** Called when the CTA button is clicked. */
  onSelect?: () => void
}

export type PricingBilling = 'monthly' | 'yearly'

export interface PricingTableProps extends ComponentProps<'div'> {
  /** Array of pricing plans to display. */
  plans: PricingPlan[]
  /** Default billing cycle. Defaults to `'monthly'`. */
  defaultBilling?: PricingBilling
  /** Currency symbol. Defaults to `'$'`. */
  currency?: string
  /** Custom header content rendered above the billing toggle. */
  header?: JSX.Element
  /** Custom footer content rendered below the plan cards. */
  footer?: JSX.Element
  /** Locale overrides. */
  locale?: Partial<PricingTableLocale>
}

// ============================================================================
// Icons
// ============================================================================

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-4 shrink-0 text-emerald-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function IconX() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-4 shrink-0 text-muted-foreground/50"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A pricing table component with billing cycle toggle and feature comparison.
 *
 * @example
 * ```tsx
 * <PricingTable
 *   plans={[
 *     {
 *       name: 'Free',
 *       priceMonthly: 0,
 *       priceYearly: 0,
 *       cta: 'Get started',
 *       features: [
 *         { text: '1 project', included: true },
 *         { text: 'Custom domain', included: false },
 *       ],
 *     },
 *     {
 *       name: 'Pro',
 *       description: 'For growing teams',
 *       priceMonthly: 19,
 *       priceYearly: 190,
 *       isPopular: true,
 *       cta: 'Get started',
 *       features: [
 *         { text: 'Unlimited projects', included: true },
 *         { text: 'Custom domain', included: true },
 *       ],
 *     },
 *   ]}
 *   currency="$"
 *   defaultBilling="monthly"
 * />
 * ```
 */
export function PricingTable(props: PricingTableProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'plans',
    'defaultBilling',
    'currency',
    'header',
    'footer',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): PricingTableLocale => ({
    ...defaultLocale,
    ...globalLocale.PricingTable,
    ...local.locale,
  })

  const [billing, setBilling] = createSignal<PricingBilling>(local.defaultBilling ?? 'monthly')
  const currency = () => local.currency ?? '$'
  const isYearly = () => billing() === 'yearly'

  const formatPrice = (plan: PricingPlan) => {
    const price = isYearly() ? plan.priceYearly : plan.priceMonthly
    return `${currency()}${price}`
  }

  return (
    <div data-slot="pricing-table" class={cx('flex flex-col gap-8', local.class)} {...rest}>
      <Show when={local.header}>{local.header}</Show>

      {/* Billing toggle */}
      <div class="flex justify-center">
        <div class="bg-muted inline-flex items-center rounded-full p-1">
          <button
            type="button"
            class={cx(
              'rounded-full px-6 py-2 text-sm font-medium transition-colors',
              !isYearly() ? 'bg-background shadow-sm' : 'text-muted-foreground',
            )}
            onClick={() => setBilling('monthly')}
          >
            {locale().monthly}
          </button>
          <button
            type="button"
            class={cx(
              'rounded-full px-6 py-2 text-sm font-medium transition-colors',
              isYearly() ? 'bg-background shadow-sm' : 'text-muted-foreground',
            )}
            onClick={() => setBilling('yearly')}
          >
            {locale().yearly}
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div
        data-slot="pricing-table-grid"
        class={cx(
          'grid grid-cols-1 gap-6',
          local.plans.length === 2 && 'md:grid-cols-2',
          local.plans.length === 3 && 'md:grid-cols-2 lg:grid-cols-3',
          local.plans.length >= 4 && 'md:grid-cols-2 lg:grid-cols-4',
        )}
      >
        <For each={local.plans}>
          {(plan) => (
            <Card
              data-slot="pricing-plan"
              class={cx(
                'relative flex flex-col',
                plan.isPopular && 'border-primary border-2 shadow-lg',
              )}
            >
              <Show when={plan.isPopular}>
                <Badge
                  class="absolute -top-3 left-1/2 -translate-x-1/2"
                  variant="default"
                >
                  {locale().popular}
                </Badge>
              </Show>

              <CardHeader class="space-y-1">
                <h3 class="text-xl font-semibold">{plan.name}</h3>
                <Show when={plan.description}>
                  <p class="text-muted-foreground text-sm">{plan.description}</p>
                </Show>
              </CardHeader>

              <CardContent class="flex flex-1 flex-col gap-6">
                {/* Price */}
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-bold">{formatPrice(plan)}</span>
                    <span class="text-muted-foreground text-sm">
                      /{isYearly() ? locale().perYear : locale().perMonth}
                    </span>
                  </div>
                  <Show when={isYearly() && plan.priceMonthly > 0}>
                    <p class="text-muted-foreground mt-1 text-xs">
                      {locale().billedYearly(currency(), plan.priceYearly)}
                    </p>
                  </Show>
                </div>

                <Separator />

                {/* Features */}
                <ul class="flex flex-1 flex-col gap-3">
                  <For each={plan.features}>
                    {(feature) => (
                      <li class="flex items-start gap-2 text-sm">
                        <Show when={feature.included} fallback={<IconX />}>
                          <IconCheck />
                        </Show>
                        <span
                          class={cx(
                            !feature.included && 'text-muted-foreground line-through',
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    )}
                  </For>
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  class="w-full"
                  variant={plan.isPopular ? 'default' : 'outline'}
                  onClick={() => plan.onSelect?.()}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          )}
        </For>
      </div>

      <Show when={local.footer}>{local.footer}</Show>
    </div>
  )
}
