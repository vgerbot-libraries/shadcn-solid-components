import { Button } from 'shadcn-solid-components/components/button'
import {
  AuthForm,
  type AuthMethod,
  type AuthMode,
} from 'shadcn-solid-components/hoc/auth-form'
import { createSignal } from 'solid-js'

const AuthFormDemo = () => {
  const [mode, setMode] = createSignal<AuthMode>('login')
  const [method, setMethod] = createSignal<AuthMethod>('password')
  const [loading, setLoading] = createSignal(false)

  return (
    <div class="flex w-full flex-col gap-4">
      <div class="rounded-lg border p-3">
        <p class="mb-2 text-xs font-medium text-muted-foreground">External Controls</p>
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode() === 'login' ? 'default' : 'outline'}
              onClick={() => setMode('login')}
            >
              Login
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode() === 'register' ? 'default' : 'outline'}
              onClick={() => setMode('register')}
            >
              Register
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode() === 'reset' ? 'default' : 'outline'}
              onClick={() => setMode('reset')}
            >
              Reset
            </Button>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={method() === 'password' ? 'secondary' : 'outline'}
              onClick={() => setMethod('password')}
            >
              Password
            </Button>
            <Button
              type="button"
              size="sm"
              variant={method() === 'phone-otp' ? 'secondary' : 'outline'}
              onClick={() => setMethod('phone-otp')}
            >
              Phone OTP
            </Button>
            <Button
              type="button"
              size="sm"
              variant={method() === 'email-otp' ? 'secondary' : 'outline'}
              onClick={() => setMethod('email-otp')}
            >
              Email OTP
            </Button>
            <Button
              type="button"
              size="sm"
              variant={method() === 'oauth' ? 'secondary' : 'outline'}
              onClick={() => setMethod('oauth')}
            >
              OAuth
            </Button>
          </div>
        </div>
      </div>

      <AuthForm
        mode={mode()}
        method={method()}
        loading={loading()}
        onForgotPassword={() => {}}
        providers={[
          {
            name: 'Google',
            icon: <span class="text-xs font-medium">G</span>,
            onSelect: () => {},
          },
          {
            name: 'GitHub',
            icon: <span class="text-xs font-medium">GH</span>,
            onSelect: () => {},
          },
        ]}
        onModeChange={next => setMode(next)}
        onMethodChange={next => setMethod(next)}
        onSendOtp={async () => {
          await Promise.resolve()
        }}
        onVerifyOtp={async payload => {
          await Promise.resolve(payload)
          return payload.otpCode === '123456'
        }}
        onValidate={payload => {
          const errors: Record<string, string> = {}
          if (payload.method === 'password' && payload.email && !payload.email.includes('@')) {
            errors.email = 'Please enter a valid email'
          }
          return Object.keys(errors).length > 0 ? { valid: false, errors } : { valid: true }
        }}
        onSubmit={payload => {
          setLoading(true)
          void Promise.resolve(payload).finally(() => setLoading(false))
        }}
        footer={
          <p class="text-center text-xs text-muted-foreground">
            This demo supports password, OTP, and OAuth in one form.
          </p>
        }
      />
    </div>
  )
}

export default AuthFormDemo
