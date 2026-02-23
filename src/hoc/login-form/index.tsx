import { useLocale } from '@/components/config-provider'
import type { LoginFormLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Checkbox, CheckboxControl, CheckboxInput, CheckboxLabel } from '@/components/checkbox'
import { IconLoader } from '@/components/icons'
import { Separator } from '@/components/separator'
import { TextField, TextFieldInput } from '@/components/text-field'
import { FormField } from '@/hoc/form-field'
import { cx } from '@/lib/cva'












// ============================================================================
// Types
// ============================================================================

export type LoginFormMode = 'login' | 'register'

export interface LoginFormProvider {
  /** Provider name (e.g. "Google", "GitHub"). */
  name: string
  /** Icon element for the provider button. */
  icon: JSX.Element
  /** Called when the provider button is clicked. */
  onSelect: () => void
}

export interface LoginFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  /** Form mode. Defaults to `'login'`. */
  mode?: LoginFormMode
  /** Logo or branding element rendered above the title. */
  logo?: JSX.Element
  /** Custom title. Overrides the locale default. */
  title?: string
  /** Custom description. Overrides the locale default. */
  description?: string
  /** OAuth / social login providers. */
  providers?: LoginFormProvider[]
  /** Show "Remember me" checkbox. Defaults to `true` in login mode. */
  showRememberMe?: boolean
  /** Href for the "Forgot password" link. Set to `false` to hide. */
  forgotPasswordHref?: string | false
  /** Called when the form is submitted. */
  onSubmit?: (data: {
    email: string
    password: string
    confirmPassword?: string
    rememberMe?: boolean
  }) => void
  /** Loading state for the submit button. */
  loading?: boolean
  /** Called when the footer link is clicked (e.g. to switch mode). */
  onModeSwitch?: () => void
  /** Extra content rendered below the form (e.g. terms of service). */
  footer?: JSX.Element
  /** Locale overrides. */
  locale?: Partial<LoginFormLocale>
}

// ============================================================================
// Component
// ============================================================================

/**
 * A pre-built login/register form card with email/password fields,
 * social provider buttons, and customizable branding.
 *
 * @example
 * ```tsx
 * <LoginForm
 *   mode="login"
 *   logo={<IconLogo class="size-8" />}
 *   providers={[
 *     { name: 'Google', icon: <IconBrandGoogle class="size-4" />, onSelect: () => signInWithGoogle() },
 *     { name: 'GitHub', icon: <IconBrandGithub class="size-4" />, onSelect: () => signInWithGithub() },
 *   ]}
 *   onSubmit={data => handleLogin(data)}
 *   onModeSwitch={() => setMode('register')}
 * />
 * ```
 */
export function LoginForm(props: LoginFormProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'mode',
    'logo',
    'title',
    'description',
    'providers',
    'showRememberMe',
    'forgotPasswordHref',
    'onSubmit',
    'loading',
    'onModeSwitch',
    'footer',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): LoginFormLocale => ({ ...defaultLocale, ...globalLocale.LoginForm, ...local.locale })
  const mode = () => local.mode ?? 'login'
  const isLogin = () => mode() === 'login'
  const showRememberMe = () => local.showRememberMe !== false && isLogin()
  const showForgotPassword = () => local.forgotPasswordHref !== false && isLogin()

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    local.onSubmit?.({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: isLogin() ? undefined : (formData.get('confirmPassword') as string),
      rememberMe: formData.get('rememberMe') === 'on',
    })
  }

  return (
    <Card data-slot="login-form" class={cx('w-full max-w-md', local.class)} {...rest}>
      <CardHeader class="text-center">
        <Show when={local.logo}>
          <div class="mb-2 flex justify-center">{local.logo}</div>
        </Show>
        <CardTitle class="text-xl">
          {local.title ?? (isLogin() ? locale().loginTitle : locale().registerTitle)}
        </CardTitle>
        <CardDescription>
          {local.description ??
            (isLogin() ? locale().loginDescription : locale().registerDescription)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          {/* Social providers */}
          <Show when={local.providers && local.providers.length > 0}>
            <div class="flex flex-col gap-2">
              <For each={local.providers}>
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

            <div class="relative">
              <Separator />
              <span class="bg-card text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                {locale().orContinueWith}
              </span>
            </div>
          </Show>

          {/* Email */}
          <FormField label={locale().emailLabel}>
            <TextField name="email" required>
              <TextFieldInput
                type="email"
                placeholder={locale().emailPlaceholder}
                autocomplete="email"
              />
            </TextField>
          </FormField>

          {/* Password */}
          <FormField
            label={
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium select-none">{locale().passwordLabel}</label>
                <Show when={showForgotPassword() && local.forgotPasswordHref}>
                  <a
                    href={local.forgotPasswordHref as string}
                    class="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
                  >
                    {locale().forgotPassword}
                  </a>
                </Show>
              </div>
            }
          >
            <TextField name="password" required>
              <TextFieldInput
                type="password"
                placeholder={locale().passwordPlaceholder}
                autocomplete={isLogin() ? 'current-password' : 'new-password'}
              />
            </TextField>
          </FormField>

          {/* Confirm password (register mode) */}
          <Show when={!isLogin()}>
            <FormField label={locale().confirmPasswordLabel}>
              <TextField name="confirmPassword" required>
                <TextFieldInput
                  type="password"
                  placeholder={locale().confirmPasswordPlaceholder}
                  autocomplete="new-password"
                />
              </TextField>
            </FormField>
          </Show>

          {/* Remember me */}
          <Show when={showRememberMe()}>
            <Checkbox name="rememberMe" class="flex items-center gap-2">
              <CheckboxInput />
              <CheckboxControl />
              <CheckboxLabel>{locale().rememberMe}</CheckboxLabel>
            </Checkbox>
          </Show>

          {/* Submit */}
          <Button type="submit" class="w-full" disabled={local.loading}>
            <Show when={local.loading}>
              <IconLoader class="mr-2 size-4 animate-spin" />
            </Show>
            {isLogin() ? locale().loginButton : locale().registerButton}
          </Button>

          {/* Mode switch */}
          <Show when={local.onModeSwitch}>
            <p class="text-muted-foreground text-center text-sm">
              {isLogin() ? locale().loginFooter : locale().registerFooter}{' '}
              <button
                type="button"
                class="text-primary cursor-pointer font-medium underline-offset-4 hover:underline"
                onClick={local.onModeSwitch}
              >
                {isLogin() ? locale().loginFooterLink : locale().registerFooterLink}
              </button>
            </p>
          </Show>

          {/* Extra footer */}
          <Show when={local.footer}>{local.footer}</Show>
        </form>
      </CardContent>
    </Card>
  )
}
