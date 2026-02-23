import type { StepperLocale } from '@/i18n/types'

export const enUS: StepperLocale = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  stepOf: (current, total) => `Step ${current} of ${total}`,
}
