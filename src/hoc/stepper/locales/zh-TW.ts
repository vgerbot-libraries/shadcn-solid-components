import type { StepperLocale } from '@/i18n/types'

export const zhTW: StepperLocale = {
  next: '下一步',
  previous: '上一步',
  finish: '完成',
  stepOf: (current, total) => `第 ${current} 步，共 ${total} 步`,
}
