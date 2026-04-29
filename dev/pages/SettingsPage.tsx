import { useColorMode } from '@kobalte/core'
import { type Component, createSignal } from 'solid-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  Checkbox,
  CheckboxControl,
  CheckboxInput,
  CheckboxLabel,
} from 'shadcn-solid-components/components/checkbox'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemInput,
  RadioGroupItemLabel,
  RadioGroupItems,
  RadioGroupLabel,
} from 'shadcn-solid-components/components/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shadcn-solid-components/components/select'
import { Separator } from 'shadcn-solid-components/components/separator'
import {
  Slider,
  SliderFill,
  SliderGroup,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from 'shadcn-solid-components/components/slider'
import {
  Switch,
  SwitchControl,
  SwitchDescription,
  SwitchInput,
  SwitchLabel,
  SwitchThumb,
} from 'shadcn-solid-components/components/switch'
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from 'shadcn-solid-components/components/text-field'
import { SettingsLayout, type SettingsSection } from 'shadcn-solid-components/hoc/settings-layout'
import type { Locale } from 'shadcn-solid-components/i18n/types'
import { setGlobalLocale } from '../store'

// ─── Locale data ────────────────────────────────────────────────────────────

const localeOptions = [
  { value: 'default', label: 'English (default)' },
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'zh-CN', label: '简体中文 (zh-CN)' },
  { value: 'zh-TW', label: '繁體中文 (zh-TW)' },
  { value: 'ja-JP', label: '日本語 (ja-JP)' },
]

const localeLoaders: Record<string, () => Promise<Locale>> = {
  'en-US': () => import('shadcn-solid-components/i18n/locales/en-US').then(m => m.enUS),
  'zh-CN': () => import('shadcn-solid-components/i18n/locales/zh-CN').then(m => m.zhCN),
  'zh-TW': () => import('shadcn-solid-components/i18n/locales/zh-TW').then(m => m.zhTW),
  'ja-JP': () => import('shadcn-solid-components/i18n/locales/ja-JP').then(m => m.jaJP),
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

// ─── Font size options ──────────────────────────────────────────────────────

const fontSizeOptions = [
  { value: 'sm', label: 'Small (14px)' },
  { value: 'md', label: 'Medium (16px)' },
  { value: 'lg', label: 'Large (18px)' },
]

// ─── Sidebar sections ───────────────────────────────────────────────────────

const sections: SettingsSection[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
  {
    id: 'language',
    label: 'Language',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="16" cy="4" r="1" />
        <path d="m18 19 1-7-6 1" />
        <path d="m5 8 3-3 5.5 3-2.36 3.5" />
        <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
        <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
      </svg>
    ),
  },
]

// ─── Section components ─────────────────────────────────────────────────────

const AppearanceSection: Component = () => {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Mode</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Font Size</CardTitle>
          <CardDescription>Set the base font size for the interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            options={fontSizeOptions}
            optionValue="value"
            optionTextValue="label"
            defaultValue={fontSizeOptions[1]}
            itemComponent={props => (
              <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
            )}
          >
            <SelectTrigger class="w-[200px]">
              <SelectValue<(typeof fontSizeOptions)[number]>>
                {state => state.selectedOption()?.label ?? 'Select size'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}

const LanguageSection: Component = () => {
  return (
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
          <SelectTrigger class="w-[240px]">
            <SelectValue<(typeof localeOptions)[number]>>
              {state => state.selectedOption()?.label ?? 'Select language'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </CardContent>
    </Card>
  )
}

const NotificationsSection: Component = () => {
  const [emailEnabled, setEmailEnabled] = createSignal(true)
  const [pushEnabled, setPushEnabled] = createSignal(false)

  return (
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Switch
            checked={emailEnabled()}
            onChange={setEmailEnabled}
            class="flex items-center justify-between gap-4"
          >
            <SwitchInput />
            <div class="flex-1">
              <SwitchLabel>Email Notifications</SwitchLabel>
              <SwitchDescription>Receive notifications via email.</SwitchDescription>
            </div>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
          <Separator />
          <Switch
            checked={pushEnabled()}
            onChange={setPushEnabled}
            class="flex items-center justify-between gap-4"
          >
            <SwitchInput />
            <div class="flex-1">
              <SwitchLabel>Push Notifications</SwitchLabel>
              <SwitchDescription>Receive push notifications in browser.</SwitchDescription>
            </div>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Select which notifications you'd like to receive.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <Checkbox defaultChecked>
            <CheckboxInput />
            <CheckboxControl />
            <CheckboxLabel>Security alerts</CheckboxLabel>
          </Checkbox>
          <Checkbox defaultChecked>
            <CheckboxInput />
            <CheckboxControl />
            <CheckboxLabel>Product updates</CheckboxLabel>
          </Checkbox>
          <Checkbox>
            <CheckboxInput />
            <CheckboxControl />
            <CheckboxLabel>Marketing emails</CheckboxLabel>
          </Checkbox>
          <Checkbox defaultChecked>
            <CheckboxInput />
            <CheckboxControl />
            <CheckboxLabel>Activity on my account</CheckboxLabel>
          </Checkbox>
        </CardContent>
      </Card>
    </div>
  )
}

const ProfileSection: Component = () => {
  return (
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <TextField>
              <TextFieldLabel>First Name</TextFieldLabel>
              <TextFieldInput placeholder="John" />
            </TextField>
            <TextField>
              <TextFieldLabel>Last Name</TextFieldLabel>
              <TextFieldInput placeholder="Doe" />
            </TextField>
          </div>
          <TextField>
            <TextFieldLabel>Email</TextFieldLabel>
            <TextFieldInput type="email" placeholder="john@example.com" />
          </TextField>
          <TextField>
            <TextFieldLabel>Bio</TextFieldLabel>
            <TextFieldTextArea placeholder="Tell us about yourself..." />
          </TextField>
        </CardContent>
      </Card>
    </div>
  )
}

const AccessibilitySection: Component = () => {
  const [reduceMotion, setReduceMotion] = createSignal(false)
  const [highContrast, setHighContrast] = createSignal(false)

  return (
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Motion & Contrast</CardTitle>
          <CardDescription>Adjust visual settings for better accessibility.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Switch
            checked={reduceMotion()}
            onChange={setReduceMotion}
            class="flex items-center justify-between gap-4"
          >
            <SwitchInput />
            <div class="flex-1">
              <SwitchLabel>Reduce Motion</SwitchLabel>
              <SwitchDescription>Minimize animations and transitions.</SwitchDescription>
            </div>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
          <Separator />
          <Switch
            checked={highContrast()}
            onChange={setHighContrast}
            class="flex items-center justify-between gap-4"
          >
            <SwitchInput />
            <div class="flex-1">
              <SwitchLabel>High Contrast</SwitchLabel>
              <SwitchDescription>
                Increase color contrast for improved readability.
              </SwitchDescription>
            </div>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zoom Level</CardTitle>
          <CardDescription>Adjust the interface zoom level.</CardDescription>
        </CardHeader>
        <CardContent>
          <Slider defaultValue={[100]} minValue={75} maxValue={200} step={25}>
            <SliderGroup>
              <SliderLabel>Zoom</SliderLabel>
              <SliderValueLabel />
            </SliderGroup>
            <SliderTrack>
              <SliderFill />
              <SliderThumb />
            </SliderTrack>
          </Slider>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

const SettingsPage: Component = () => {
  return (
    <SettingsLayout
      sections={sections}
      defaultActiveSection="appearance"
      overlay={true}
      title="Settings"
      description="Manage appearance, language, notifications, and accessibility preferences."
      backLabel="Back"
    >
      {{
        appearance: <AppearanceSection />,
        language: <LanguageSection />,
        notifications: <NotificationsSection />,
        profile: <ProfileSection />,
        accessibility: <AccessibilitySection />,
      }}
    </SettingsLayout>
  )
}

export default SettingsPage
