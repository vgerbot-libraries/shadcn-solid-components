import type { PricingTableLocale } from 'shadcn-solid-components/i18n/types'

export const zhTW: PricingTableLocale = {
  monthly: '月付',
  yearly: '年付',
  popular: '最受歡迎',
  perMonth: '月',
  perYear: '年',
  billedYearly: (currency, amount) => `按年計費 ${currency}${amount}/年`,
}
