import { Button } from 'shadcn-solid-components/components/button'
import {
  AuthForm,
  type AuthCredentialMethodControl,
  type AuthMethod,
  type AuthMode,
} from 'shadcn-solid-components/hoc/auth-form'
import { createMemo, createSignal } from 'solid-js'

type ControlKind = 'tabs' | 'custom-element' | 'custom-render'

const AuthFormCredentialMethodControlDemo = () => {
  const [mode, setMode] = createSignal<AuthMode>('login')
  const [method, setMethod] = createSignal<AuthMethod>('password')
  const [controlKind, setControlKind] = createSignal<ControlKind>('tabs')

  const credentialMethodControl = createMemo<AuthCredentialMethodControl>(() => {
    if (controlKind() === 'tabs') {
      return [
        { key: 'password', label: 'Password', icon: <span class="text-xs">🔒</span> },
        { key: 'phone-otp', label: 'Phone OTP', icon: <span class="text-xs">📱</span> },
        { key: 'email-otp', label: 'Email OTP', icon: <span class="text-xs">📧</span> },
      ]
    }

    if (controlKind() === 'custom-element') {
      return (
        <div class="grid grid-cols-3 gap-2">
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
        </div>
      )
    }

    return () => (
      <div class="rounded-md border border-dashed p-2">
        <p class="mb-2 text-xs text-muted-foreground">Custom render function control</p>
        <div class="grid grid-cols-3 gap-2">
          <Button
            type="button"
            size="sm"
            variant={method() === 'password' ? 'default' : 'ghost'}
            onClick={() => setMethod('password')}
          >
            Password
          </Button>
          <Button
            type="button"
            size="sm"
            variant={method() === 'phone-otp' ? 'default' : 'ghost'}
            onClick={() => setMethod('phone-otp')}
          >
            Phone OTP
          </Button>
          <Button
            type="button"
            size="sm"
            variant={method() === 'email-otp' ? 'default' : 'ghost'}
            onClick={() => setMethod('email-otp')}
          >
            Email OTP
          </Button>
        </div>
      </div>
    )
  })

  return (
    <div class="flex w-full flex-col gap-4">
      <div class="rounded-lg border p-3">
        <p class="mb-2 text-xs font-medium text-muted-foreground">Control style</p>
        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={controlKind() === 'tabs' ? 'default' : 'outline'}
            onClick={() => setControlKind('tabs')}
          >
            Config Array (Tabs)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={controlKind() === 'custom-element' ? 'default' : 'outline'}
            onClick={() => setControlKind('custom-element')}
          >
            Custom JSX.Element
          </Button>
          <Button
            type="button"
            size="sm"
            variant={controlKind() === 'custom-render' ? 'default' : 'outline'}
            onClick={() => setControlKind('custom-render')}
          >
            Custom () =&gt; JSX.Element
          </Button>
        </div>
      </div>

      <div class="rounded-lg border p-3">
        <p class="mb-2 text-xs font-medium text-muted-foreground">External mode + method</p>
        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode() === 'login' ? 'secondary' : 'outline'}
            onClick={() => setMode('login')}
          >
            Login
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode() === 'register' ? 'secondary' : 'outline'}
            onClick={() => setMode('register')}
          >
            Register
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode() === 'reset' ? 'secondary' : 'outline'}
            onClick={() => setMode('reset')}
          >
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            variant={method() === 'oauth' ? 'secondary' : 'outline'}
            onClick={() => setMethod('oauth')}
          >
            OAuth (hide slot)
          </Button>
        </div>
      </div>

      <AuthForm
        mode={mode()}
        method={method()}
        credentialMethodControl={credentialMethodControl()}
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
        onModeChange={setMode}
        onMethodChange={setMethod}
        onSendOtp={async () => {
          await Promise.resolve()
        }}
        onVerifyOtp={async payload => {
          await Promise.resolve(payload)
          return payload.otpCode === '123456'
        }}
        onSubmit={() => {}}
      />
    </div>
  )
}

export default AuthFormCredentialMethodControlDemo
