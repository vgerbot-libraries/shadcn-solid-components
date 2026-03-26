import { useColorMode } from '@kobalte/core'
import { type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemInput,
  RadioGroupItemLabel,
  RadioGroupItems,
  RadioGroupLabel,
} from '@/components/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import type { Locale } from '@/i18n/types'
import { PageLayout } from '../components/PageLayout'
import { setGlobalLocale } from '../store'

const localeOptions = [
  { value: 'default', label: 'English (default)' },
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'zh-CN', label: '简体中文 (zh-CN)' },
  { value: 'zh-TW', label: '繁體中文 (zh-TW)' },
  { value: 'ja-JP', label: '日本語 (ja-JP)' },
]

const localeLoaders: Record<string, () => Promise<Locale>> = {
  'en-US': () => import('@/i18n/locales/en-US').then(m => m.enUS),
  'zh-CN': () => import('@/i18n/locales/zh-CN').then(m => m.zhCN),
  'zh-TW': () => import('@/i18n/locales/zh-TW').then(m => m.zhTW),
  'ja-JP': () => import('@/i18n/locales/ja-JP').then(m => m.jaJP),
}

async function handleLocaleChange(value: string) {
  if (value === 'default' || !value) {
    setGlobalLocale({})
    return
  }
  const loader = localeLoaders[value]
  if (loader) {
    const locale = await loader()
    setGlobalLocale(locale)
  }
}

const SettingsPage: Component = () => {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <PageLayout title="Settings" description="Manage theme appearance and language preferences.">
      <div class="grid gap-6 md:grid-cols-2">
        {/* Theme / Color Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your preferred color mode.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={colorMode()}
              onChange={v => setColorMode(v as 'light' | 'dark' | 'system')}
            >
              <RadioGroupLabel class="sr-only">Color Mode</RadioGroupLabel>
              <RadioGroupItems>
                <RadioGroupItem value="light">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>Light</RadioGroupItemLabel>
                </RadioGroupItem>
                <RadioGroupItem value="dark">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>Dark</RadioGroupItemLabel>
                </RadioGroupItem>
                <RadioGroupItem value="system">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel>System</RadioGroupItemLabel>
                </RadioGroupItem>
              </RadioGroupItems>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Locale */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>
              Select a locale for all components. This sets the global ConfigProvider locale.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              options={localeOptions}
              optionValue="value"
              optionTextValue="label"
              defaultValue={localeOptions[0]}
              onChange={opt => {
                if (opt) handleLocaleChange(opt.value)
              }}
              itemComponent={props => (
                <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<(typeof localeOptions)[number]>>
                  {state => state.selectedOption()?.label ?? 'Select language'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default SettingsPage
