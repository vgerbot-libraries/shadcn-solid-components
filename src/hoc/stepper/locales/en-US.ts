import type { StepperLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: StepperLocale = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  stepOf: (current, total) => `Step ${current} of ${total}`,
}
