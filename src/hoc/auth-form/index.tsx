import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { IconLoader } from 'shadcn-solid-components/components/icons'
import { Separator } from 'shadcn-solid-components/components/separator'
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from 'shadcn-solid-components/components/tabs'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { FormField } from 'shadcn-solid-components/hoc/form-field'
import type { AuthFormLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

export type AuthMode = 'login' | 'register' | 'reset'

export type AuthMethod = 'password' | 'phone-otp' | 'email-otp' | 'oauth'

export type AuthCredentialMethod = 'password' | 'phone-otp' | 'email-otp'

export interface AuthCredentialMethodConfig {
  key: AuthCredentialMethod
  label?: string
  icon?: JSX.Element
}

export type AuthCredentialMethodControl =
  | AuthCredentialMethodConfig[]
  | JSX.Element
  | (() => JSX.Element)

const isAuthCredentialMethod = (value: unknown): value is AuthCredentialMethod =>
  value === 'password' || value === 'phone-otp' || value === 'email-otp'

const isAuthCredentialMethodConfig = (value: unknown): value is AuthCredentialMethodConfig => {
  if (!value || typeof value !== 'object') return false
  if (!('key' in value)) return false
  return isAuthCredentialMethod((value as { key: unknown }).key)
}

const isAuthCredentialMethodConfigArray = (
  value: AuthCredentialMethodControl | undefined,
): value is AuthCredentialMethodConfig[] =>
  Array.isArray(value) && value.every(isAuthCredentialMethodConfig)

export type AuthFieldErrorKey =
  | 'email'
  | 'phone'
  | 'password'
  | 'newPassword'
  | 'confirmPassword'
  | 'otpCode'

export interface AuthProvider {
  name: string
  icon: JSX.Element
  onSelect: () => void
}

export interface AuthSubmitPayload {
  mode: AuthMode
  method: AuthMethod
  email?: string
  phone?: string
  password?: string
  newPassword?: string
  confirmPassword?: string
  otpCode?: string
  rememberMe?: boolean
}

export interface AuthValidationResult {
  valid: boolean
  errors?: {
    [key in AuthFieldErrorKey]?: string
  }
}

export interface AuthFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  mode?: AuthMode
  defaultMode?: AuthMode
  onModeChange?: (mode: AuthMode) => void
  method?: AuthMethod
  defaultMethod?: AuthMethod
  onMethodChange?: (method: AuthMethod) => void
  enabledModes?: AuthMode[]
  enabledMethods?: AuthMethod[]
  logo?: JSX.Element
  title?: string
  description?: string
  providers?: AuthProvider[]
  showRememberMe?: boolean
  onForgotPassword?: () => void
  loading?: boolean
  onSendOtp?: (payload: {
    mode: AuthMode
    method: Extract<AuthMethod, 'phone-otp' | 'email-otp'>
    target: string
  }) => void | Promise<void>
  onVerifyOtp?: (payload: {
    mode: AuthMode
    method: Extract<AuthMethod, 'phone-otp' | 'email-otp'>
    target: string
    otpCode: string
  }) => boolean | Promise<boolean>
  onValidate?: (payload: AuthSubmitPayload) => AuthValidationResult | Promise<AuthValidationResult>
  onSubmit?: (payload: AuthSubmitPayload) => void
  credentialMethodControl?: AuthCredentialMethodControl
  footer?: JSX.Element
  locale?: Partial<AuthFormLocale>
}

export function AuthForm(props: AuthFormProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'mode',
    'defaultMode',
    'onModeChange',
    'method',
    'defaultMethod',
    'onMethodChange',
    'enabledModes',
    'enabledMethods',
    'logo',
    'title',
    'description',
    'providers',
    'showRememberMe',
    'onForgotPassword',
    'loading',
    'onSendOtp',
    'onVerifyOtp',
    'onValidate',
    'onSubmit',
    'credentialMethodControl',
    'footer',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): AuthFormLocale => ({
    ...defaultLocale,
    ...globalLocale.AuthForm,
    ...local.locale,
  })

  const [internalMode, setInternalMode] = createSignal<AuthMode>(local.defaultMode ?? 'login')
  const [internalMethod, setInternalMethod] = createSignal<AuthMethod>(
    local.defaultMethod ?? 'password',
  )
  const [sendingOtp, setSendingOtp] = createSignal(false)
  const [verifyingOtp, setVerifyingOtp] = createSignal(false)
  const [fieldErrors, setFieldErrors] = createSignal<Partial<Record<AuthFieldErrorKey, string>>>({})

  let formRef: HTMLFormElement | undefined

  const mode = () => local.mode ?? internalMode()
  const method = () => local.method ?? internalMethod()

  const enabledModes = () => {
    const source =
      local.enabledModes && local.enabledModes.length > 0
        ? local.enabledModes
        : (['login', 'register', 'reset'] as AuthMode[])
    return source.filter((value, index, array) => array.indexOf(value) === index)
  }

  const enabledMethods = () => {
    const source =
      local.enabledMethods && local.enabledMethods.length > 0
        ? local.enabledMethods
        : (['password', 'phone-otp', 'email-otp', 'oauth'] as AuthMethod[])
    const deduped = source.filter((value, index, array) => array.indexOf(value) === index)
    if (!local.providers || local.providers.length === 0) {
      return deduped.filter(item => item !== 'oauth')
    }
    return deduped
  }

  const isOtpMethod = createMemo(() => method() === 'phone-otp' || method() === 'email-otp')
  const isPasswordMethod = createMemo(() => method() === 'password')
  const isOauthMethod = createMemo(() => method() === 'oauth')
  const isLoginMode = createMemo(() => mode() === 'login')
  const isRegisterMode = createMemo(() => mode() === 'register')
  const isResetMode = createMemo(() => mode() === 'reset')

  const setMode = (nextMode: AuthMode) => {
    if (local.mode === undefined) {
      setInternalMode(nextMode)
    }
    local.onModeChange?.(nextMode)
  }

  const setMethod = (nextMethod: AuthMethod) => {
    if (local.method === undefined) {
      setInternalMethod(nextMethod)
    }
    local.onMethodChange?.(nextMethod)
  }

  createEffect(() => {
    const modes = enabledModes()
    if (modes.length === 0) return
    if (!modes.includes(mode())) {
      setMode(modes[0] as AuthMode)
    }
  })

  createEffect(() => {
    const methods = enabledMethods()
    if (methods.length === 0) return
    if (!methods.includes(method())) {
      setMethod(methods[0] as AuthMethod)
    }
  })

  createEffect(() => {
    mode()
    method()
    setFieldErrors({})
  })

  const titleText = () => {
    if (local.title) return local.title
    if (isLoginMode()) return locale().loginTitle
    if (isRegisterMode()) return locale().registerTitle
    return locale().resetTitle
  }

  const descriptionText = () => {
    if (local.description) return local.description
    if (isLoginMode()) return locale().loginDescription
    if (isRegisterMode()) return locale().registerDescription
    return locale().resetDescription
  }

  const submitLabel = () => {
    if (isLoginMode()) return locale().loginButton
    if (isRegisterMode()) return locale().registerButton
    return locale().resetButton
  }

  const targetFieldName = () => (method() === 'phone-otp' ? 'phone' : 'email')

  const targetFieldLabel = () =>
    method() === 'phone-otp' ? locale().phoneLabel : locale().emailLabel

  const targetFieldPlaceholder = () =>
    method() === 'phone-otp' ? locale().phonePlaceholder : locale().emailPlaceholder

  const readPayload = (formData: FormData): AuthSubmitPayload => {
    const payload: AuthSubmitPayload = {
      mode: mode(),
      method: method(),
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      password: (formData.get('password') as string) || undefined,
      newPassword: (formData.get('newPassword') as string) || undefined,
      confirmPassword: (formData.get('confirmPassword') as string) || undefined,
      otpCode: (formData.get('otpCode') as string) || undefined,
      rememberMe: formData.get('rememberMe') === 'on',
    }

    return payload
  }

  const validateBasic = (payload: AuthSubmitPayload) => {
    const errors: Partial<Record<AuthFieldErrorKey, string>> = {}

    if (isPasswordMethod()) {
      if (!payload.email) {
        errors.email = locale().emailRequired
      } else if (!payload.email.includes('@')) {
        errors.email = locale().invalidEmail
      }

      if (isResetMode()) {
        if (!payload.newPassword) {
          errors.newPassword = locale().passwordRequired
        } else if (payload.newPassword.length < 8) {
          errors.newPassword = locale().passwordTooShort
        }
      } else if (!payload.password) {
        errors.password = locale().passwordRequired
      } else if (payload.password.length < 8) {
        errors.password = locale().passwordTooShort
      }

      if (
        (isRegisterMode() || isResetMode()) &&
        payload.confirmPassword !== (payload.newPassword ?? payload.password)
      ) {
        errors.confirmPassword = locale().confirmPasswordMismatch
      }
    }

    if (isOtpMethod()) {
      const targetValue = method() === 'phone-otp' ? payload.phone : payload.email
      if (!targetValue) {
        if (method() === 'phone-otp') {
          errors.phone = locale().phoneRequired
        } else {
          errors.email = locale().emailRequired
        }
      }
      if (method() === 'email-otp' && targetValue && !targetValue.includes('@')) {
        errors.email = locale().invalidEmail
      }

      if (!payload.otpCode) {
        errors.otpCode = locale().otpCodeRequired
      }

      if (isResetMode()) {
        if (!payload.newPassword) {
          errors.newPassword = locale().passwordRequired
        } else if (payload.newPassword.length < 8) {
          errors.newPassword = locale().passwordTooShort
        }

        if (payload.confirmPassword !== payload.newPassword) {
          errors.confirmPassword = locale().confirmPasswordMismatch
        }
      }
    }

    return errors
  }

  const handleSendOtp = async () => {
    if (!isOtpMethod() || !formRef) return

    const formData = new FormData(formRef)
    const fieldName = targetFieldName()
    const target = ((formData.get(fieldName) as string) || '').trim()
    const nextErrors: Partial<Record<AuthFieldErrorKey, string>> = {}

    if (!target) {
      if (fieldName === 'phone') {
        nextErrors.phone = locale().phoneRequired
      } else {
        nextErrors.email = locale().emailRequired
      }
      setFieldErrors(nextErrors)
      return
    }

    if (fieldName === 'email' && !target.includes('@')) {
      nextErrors.email = locale().invalidEmail
      setFieldErrors(nextErrors)
      return
    }

    setSendingOtp(true)
    try {
      await local.onSendOtp?.({
        mode: mode(),
        method: method() as Extract<AuthMethod, 'phone-otp' | 'email-otp'>,
        target,
      })
      setFieldErrors(prev => ({ ...prev, email: undefined, phone: undefined }))
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    if (!formRef) return
    const formData = new FormData(formRef)
    const payload = readPayload(formData)
    const basicErrors = validateBasic(payload)

    if (Object.keys(basicErrors).length > 0) {
      setFieldErrors(basicErrors)
      return
    }

    if (local.onValidate) {
      const result = local.onValidate(payload)
      const validation = result instanceof Promise ? await result : result
      if (!validation.valid) {
        setFieldErrors(validation.errors || {})
        return
      }
    }

    if (isOtpMethod() && local.onVerifyOtp) {
      const target = (method() === 'phone-otp' ? payload.phone : payload.email) || ''
      const otpCode = payload.otpCode || ''
      setVerifyingOtp(true)
      try {
        const verifyResult = await local.onVerifyOtp({
          mode: mode(),
          method: method() as Extract<AuthMethod, 'phone-otp' | 'email-otp'>,
          target,
          otpCode,
        })
        if (verifyResult === false) {
          setFieldErrors(prev => ({ ...prev, otpCode: locale().otpVerifyFailed }))
          return
        }
      } finally {
        setVerifyingOtp(false)
      }
    }

    setFieldErrors({})
    local.onSubmit?.(payload)
  }

  const showRememberMe = () => local.showRememberMe !== false && isLoginMode() && isPasswordMethod()

  const showForgotPassword = () => !!local.onForgotPassword && isLoginMode() && isPasswordMethod()

  const enabledCredentialMethods = createMemo(() =>
    enabledMethods().filter((item): item is AuthCredentialMethod => item !== 'oauth'),
  )

  const credentialMethodOptions = createMemo<AuthCredentialMethodConfig[]>(() => {
    const control = local.credentialMethodControl
    if (!isAuthCredentialMethodConfigArray(control)) return []

    const enabled = enabledCredentialMethods()
    const seen = new Set<AuthCredentialMethod>()

    return control.filter(config => {
      if (!enabled.includes(config.key) || seen.has(config.key)) {
        return false
      }
      seen.add(config.key)
      return true
    })
  })

  const credentialMethodLabel = (credentialMethod: AuthCredentialMethod) => {
    if (credentialMethod === 'password') return locale().methodPassword
    if (credentialMethod === 'phone-otp') return locale().methodPhoneOtp
    return locale().methodEmailOtp
  }

  const handleCredentialMethodTabChange = (nextMethod: string) => {
    if (nextMethod === 'password' || nextMethod === 'phone-otp' || nextMethod === 'email-otp') {
      setMethod(nextMethod)
    }
  }

  const renderCredentialMethodControl = () => {
    const control = local.credentialMethodControl
    if (!control) return null

    if (Array.isArray(control) && !isAuthCredentialMethodConfigArray(control)) {
      return null
    }

    if (isAuthCredentialMethodConfigArray(control)) {
      const options = credentialMethodOptions()
      if (options.length === 0) return null

      return (
        <Tabs value={method()} onChange={handleCredentialMethodTabChange}>
          <TabsList
            class="grid w-full"
            style={{ 'grid-template-columns': `repeat(${options.length}, minmax(0, 1fr))` }}
          >
            <For each={options}>
              {config => (
                <TabsTrigger value={config.key}>
                  <Show when={config.icon}>{config.icon}</Show>
                  <span>{config.label ?? credentialMethodLabel(config.key)}</span>
                </TabsTrigger>
              )}
            </For>
            <TabsIndicator />
          </TabsList>
        </Tabs>
      )
    }

    if (typeof control === 'function') {
      return control()
    }

    return control
  }

  return (
    <Card data-slot="auth-form" class={cx('w-full max-w-md', local.class)} {...rest}>
      <CardHeader class="text-center">
        <Show when={local.logo}>
          <div class="mb-2 flex justify-center">{local.logo}</div>
        </Show>
        <CardTitle class="text-xl">{titleText()}</CardTitle>
        <CardDescription>{descriptionText()}</CardDescription>
      </CardHeader>

      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} class="flex flex-col gap-4">
          <Show when={local.providers && local.providers.length}>
            <div class="flex flex-col gap-2">
              <For each={local.providers || []}>
                {provider => (
                  <Button
                    type="button"
                    variant="outline"
                    class="w-full"
                    onClick={provider.onSelect}
                  >
                    {provider.icon}
                    <span class="ml-2">{provider.name}</span>
                  </Button>
                )}
              </For>
            </div>

            <Show when={!isOauthMethod()}>
              <div class="relative">
                <Separator />
                <span class="bg-card text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                  {locale().orContinueWith}
                </span>
              </div>
            </Show>
          </Show>
          <Show when={!isOauthMethod()}>{renderCredentialMethodControl()}</Show>
          <Show when={!isOauthMethod()}>
            <Show when={isPasswordMethod()}>
              <FormField label={locale().emailLabel} error={fieldErrors().email}>
                <TextField name="email" required>
                  <TextFieldInput
                    type="email"
                    placeholder={locale().emailPlaceholder}
                    autocomplete="email"
                  />
                </TextField>
              </FormField>

              <Show when={!isResetMode()}>
                <FormField
                  label={
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium select-none">
                        {locale().passwordLabel}
                      </label>
                      <Show when={showForgotPassword()}>
                        <Button
                          size="sm"
                          variant="link"
                          onClick={local.onForgotPassword}
                          class="text-xs h-4 px-0 text-muted-foreground"
                        >
                          {locale().forgotPassword}
                        </Button>
                      </Show>
                    </div>
                  }
                  error={fieldErrors().password}
                >
                  <TextField name="password" required>
                    <TextFieldInput
                      type="password"
                      placeholder={locale().passwordPlaceholder}
                      autocomplete={isLoginMode() ? 'current-password' : 'new-password'}
                    />
                  </TextField>
                </FormField>
              </Show>

              <Show when={isResetMode()}>
                <FormField label={locale().newPasswordLabel} error={fieldErrors().newPassword}>
                  <TextField name="newPassword" required>
                    <TextFieldInput
                      type="password"
                      placeholder={locale().newPasswordPlaceholder}
                      autocomplete="new-password"
                    />
                  </TextField>
                </FormField>
              </Show>

              <Show when={isRegisterMode() || isResetMode()}>
                <FormField
                  label={locale().confirmPasswordLabel}
                  error={fieldErrors().confirmPassword}
                >
                  <TextField name="confirmPassword" required>
                    <TextFieldInput
                      type="password"
                      placeholder={locale().confirmPasswordPlaceholder}
                      autocomplete="new-password"
                    />
                  </TextField>
                </FormField>
              </Show>
            </Show>

            <Show when={isOtpMethod()}>
              <FormField
                label={targetFieldLabel()}
                error={fieldErrors().phone || fieldErrors().email}
              >
                <TextField name={targetFieldName()} required>
                  <TextFieldInput
                    type={method() === 'phone-otp' ? 'tel' : 'email'}
                    placeholder={targetFieldPlaceholder()}
                    autocomplete={method() === 'phone-otp' ? 'tel' : 'email'}
                  />
                </TextField>
              </FormField>

              <FormField label={locale().otpCodeLabel} error={fieldErrors().otpCode}>
                <div class="flex items-center gap-2">
                  <TextField name="otpCode" required class="flex-1">
                    <TextFieldInput type="text" placeholder={locale().otpCodePlaceholder} />
                  </TextField>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOtp}
                    disabled={sendingOtp()}
                  >
                    <Show when={sendingOtp()}>
                      <IconLoader class="mr-2 size-4 animate-spin" />
                    </Show>
                    {locale().sendCodeButton}
                  </Button>
                </div>
              </FormField>

              <Show when={isResetMode()}>
                <FormField label={locale().newPasswordLabel} error={fieldErrors().newPassword}>
                  <TextField name="newPassword" required>
                    <TextFieldInput
                      type="password"
                      placeholder={locale().newPasswordPlaceholder}
                      autocomplete="new-password"
                    />
                  </TextField>
                </FormField>

                <FormField
                  label={locale().confirmPasswordLabel}
                  error={fieldErrors().confirmPassword}
                >
                  <TextField name="confirmPassword" required>
                    <TextFieldInput
                      type="password"
                      placeholder={locale().confirmPasswordPlaceholder}
                      autocomplete="new-password"
                    />
                  </TextField>
                </FormField>
              </Show>
            </Show>

            <Show when={showRememberMe()}>
              <label class="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="rememberMe" class="accent-primary" />
                <span>{locale().rememberMe}</span>
              </label>
            </Show>

            <Button type="submit" class="w-full" disabled={local.loading || verifyingOtp()}>
              <Show when={local.loading || verifyingOtp()}>
                <IconLoader class="mr-2 size-4 animate-spin" />
              </Show>
              {submitLabel()}
            </Button>
          </Show>

          <p class="text-muted-foreground text-center text-sm">
            <Show
              when={isLoginMode()}
              fallback={
                <Show
                  when={isRegisterMode()}
                  fallback={
                    <button
                      type="button"
                      class="text-primary cursor-pointer font-medium underline-offset-4 hover:underline"
                      onClick={() => setMode('login')}
                    >
                      {locale().backToLogin}
                    </button>
                  }
                >
                  {locale().registerFooter}{' '}
                  <button
                    type="button"
                    class="text-primary cursor-pointer font-medium underline-offset-4 hover:underline"
                    onClick={() => setMode('login')}
                  >
                    {locale().registerFooterLink}
                  </button>
                </Show>
              }
            >
              {locale().loginFooter}{' '}
              <button
                type="button"
                class="text-primary cursor-pointer font-medium underline-offset-4 hover:underline"
                onClick={() => setMode('register')}
              >
                {locale().loginFooterLink}
              </button>
            </Show>
          </p>

          <Show when={local.footer}>{local.footer}</Show>
        </form>
      </CardContent>
    </Card>
  )
}
