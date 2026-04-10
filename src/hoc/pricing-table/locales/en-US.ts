import type { PricingTableLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: PricingTableLocale = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  popular: 'Most Popular',
  perMonth: 'mo',
  perYear: 'yr',
  billedYearly: (currency, amount) => `Billed at ${currency}${amount} /yr`,
}
