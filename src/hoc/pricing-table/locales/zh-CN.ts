import type { PricingTableLocale } from 'shadcn-solid-components/i18n/types'

export const zhCN: PricingTableLocale = {
  monthly: '月付',
  yearly: '年付',
  popular: '最受欢迎',
  perMonth: '月',
  perYear: '年',
  billedYearly: (currency, amount) => `按年计费 ${currency}${amount}/年`,
  additionalFeatures: '附加功能',
}
