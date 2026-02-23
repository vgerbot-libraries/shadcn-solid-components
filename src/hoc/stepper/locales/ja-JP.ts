import type { StepperLocale } from '@/i18n/types'

export const jaJP: StepperLocale = {
  next: '次へ',
  previous: '戻る',
  finish: '完了',
  stepOf: (current, total) => `${total} 中 ${current} ステップ`,
}
