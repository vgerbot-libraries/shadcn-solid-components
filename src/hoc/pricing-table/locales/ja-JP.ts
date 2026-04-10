import type { PricingTableLocale } from 'shadcn-solid-components/i18n/types'

export const jaJP: PricingTableLocale = {
  monthly: '月払い',
  yearly: '年払い',
  popular: '一番人気',
  perMonth: '月',
  perYear: '年',
  billedYearly: (currency, amount) => `年額 ${currency}${amount}`,
  additionalFeatures: '追加機能',
}
