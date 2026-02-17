import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Separator } from '@/components/separator'
import { cx } from '@/lib/cva'

// ============================================================================
// Locale
// ============================================================================

export interface LoginFormLocale {
  loginTitle: string
  loginDescription: string
  registerTitle: string
  registerDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  rememberMe: string
  forgotPassword: string
  loginButton: string
  registerButton: string
  loginFooter: string
  loginFooterLink: string
  registerFooter: string
  registerFooterLink: string
  orContinueWith: string
}

export const enLocale: LoginFormLocale = {
  loginTitle: 'Sign in',
  loginDescription: 'Enter your credentials to access your account',
  registerTitle: 'Create account',
  registerDescription: 'Enter your details to create a new account',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  confirmPasswordLabel: 'Confirm password',
  confirmPasswordPlaceholder: 'Confirm your password',
  rememberMe: 'Remember me',
  forgotPassword: 'Forgot password?',
  loginButton: 'Sign in',
  registerButton: 'Create account',
  loginFooter: "Don't have an account?",
  loginFooterLink: 'Sign up',
  registerFooter: 'Already have an account?',
  registerFooterLink: 'Sign in',
  orContinueWith: 'Or continue with',
}

export const zhCNLocale: LoginFormLocale = {
  loginTitle: '登录',
  loginDescription: '输入你的凭据以访问账户',
  registerTitle: '创建账户',
  registerDescription: '输入你的信息以创建新账户',
  emailLabel: '邮箱',
  emailPlaceholder: 'you@example.com',
  passwordLabel: '密码',
  passwordPlaceholder: '输入密码',
  confirmPasswordLabel: '确认密码',
  confirmPasswordPlaceholder: '确认密码',
  rememberMe: '记住我',
  forgotPassword: '忘记密码？',
  loginButton: '登录',
  registerButton: '创建账户',
  loginFooter: '还没有账户？',
  loginFooterLink: '注册',
  registerFooter: '已有账户？',
  registerFooterLink: '登录',
  orContinueWith: '或通过以下方式继续',
}

export const zhTWLocale: LoginFormLocale = {
  loginTitle: '登入',
  loginDescription: '輸入你的憑據以存取帳戶',
  registerTitle: '建立帳戶',
  registerDescription: '輸入你的資訊以建立新帳戶',
  emailLabel: '電子郵件',
  emailPlaceholder: 'you@example.com',
  passwordLabel: '密碼',
  passwordPlaceholder: '輸入密碼',
  confirmPasswordLabel: '確認密碼',
  confirmPasswordPlaceholder: '確認密碼',
  rememberMe: '記住我',
  forgotPassword: '忘記密碼？',
  loginButton: '登入',
  registerButton: '建立帳戶',
  loginFooter: '還沒有帳戶？',
  loginFooterLink: '註冊',
  registerFooter: '已有帳戶？',
  registerFooterLink: '登入',
  orContinueWith: '或透過以下方式繼續',
}

export const jaLocale: LoginFormLocale = {
  loginTitle: 'ログイン',
  loginDescription: 'アカウントにアクセスするための資格情報を入力してください',
  registerTitle: 'アカウント作成',
  registerDescription: '新しいアカウントを作成するための情報を入力してください',
  emailLabel: 'メールアドレス',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'パスワード',
  passwordPlaceholder: 'パスワードを入力',
  confirmPasswordLabel: 'パスワード確認',
  confirmPasswordPlaceholder: 'パスワードを確認',
  rememberMe: 'ログイン状態を保持',
  forgotPassword: 'パスワードを忘れた場合',
  loginButton: 'ログイン',
  registerButton: 'アカウント作成',
  loginFooter: 'アカウントをお持ちでない方は',
  loginFooterLink: '新規登録',
  registerFooter: 'すでにアカウントをお持ちの方は',
  registerFooterLink: 'ログイン',
  orContinueWith: 'または以下で続行',
}

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
  onSubmit?: (data: { email: string; password: string; confirmPassword?: string; rememberMe?: boolean }) => void
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

  const locale = (): LoginFormLocale => ({ ...enLocale, ...local.locale })
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

  const inputClass = cx(
    'placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'rounded-md',
  )

  return (
    <Card
      data-slot="login-form"
      class={cx('w-full max-w-md', local.class)}
      {...rest}
    >
      <CardHeader class="text-center">
        <Show when={local.logo}>
          <div class="mb-2 flex justify-center">{local.logo}</div>
        </Show>
        <CardTitle class="text-xl">
          {local.title ?? (isLogin() ? locale().loginTitle : locale().registerTitle)}
        </CardTitle>
        <CardDescription>
          {local.description ?? (isLogin() ? locale().loginDescription : locale().registerDescription)}
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
          <div class="grid gap-2">
            <label for="login-email" class="text-sm font-medium">
              {locale().emailLabel}
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder={locale().emailPlaceholder}
              required
              autocomplete="email"
              class={inputClass}
            />
          </div>

          {/* Password */}
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <label for="login-password" class="text-sm font-medium">
                {locale().passwordLabel}
              </label>
              <Show when={showForgotPassword() && local.forgotPasswordHref}>
                <a
                  href={local.forgotPasswordHref as string}
                  class="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
                >
                  {locale().forgotPassword}
                </a>
              </Show>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder={locale().passwordPlaceholder}
              required
              autocomplete={isLogin() ? 'current-password' : 'new-password'}
              class={inputClass}
            />
          </div>

          {/* Confirm password (register mode) */}
          <Show when={!isLogin()}>
            <div class="grid gap-2">
              <label for="login-confirm-password" class="text-sm font-medium">
                {locale().confirmPasswordLabel}
              </label>
              <input
                id="login-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder={locale().confirmPasswordPlaceholder}
                required
                autocomplete="new-password"
                class={inputClass}
              />
            </div>
          </Show>

          {/* Remember me */}
          <Show when={showRememberMe()}>
            <div class="flex items-center gap-2">
              <input
                id="login-remember"
                name="rememberMe"
                type="checkbox"
                class="accent-primary size-4 rounded"
              />
              <label for="login-remember" class="text-sm select-none">
                {locale().rememberMe}
              </label>
            </div>
          </Show>

          {/* Submit */}
          <Button type="submit" class="w-full" disabled={local.loading}>
            <Show when={local.loading}>
              <svg class="mr-2 size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
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
