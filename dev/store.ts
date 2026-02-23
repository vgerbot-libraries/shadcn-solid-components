import { createSignal } from 'solid-js'
import type { Locale } from '../src/i18n/types'

export const [globalLocale, setGlobalLocale] = createSignal<Partial<Locale>>({})
