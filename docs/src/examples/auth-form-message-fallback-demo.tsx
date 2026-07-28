import { AuthForm } from 'shadcn-solid-components/hoc/auth-form'
import { createSignal, Show } from 'solid-js'

const AuthFormMessageFallbackDemo = () => {
  const [lastError, setLastError] = createSignal('')

  return (
    <div class="flex w-full flex-col gap-4">
      <AuthForm
        enabledModes={['login']}
        enabledMethods={['email-otp']}
        onSendOtp={async () => {
          await new Promise(resolve => setTimeout(resolve, 600))
          throw new Error('Failed to send verification code. Please try again.')
        }}
        onVerifyOtp={async payload => {
          await new Promise(resolve => setTimeout(resolve, 600))
          if (payload.otpCode !== '123456') {
            throw new Error('Verification service unavailable. Please retry later.')
          }
          return true
        }}
        onError={error => setLastError(error instanceof Error ? error.message : String(error))}
        onSubmit={() => {}}
      />
      <Show when={lastError()}>
        <p class="text-xs text-muted-foreground">onError captured: {lastError()}</p>
      </Show>
    </div>
  )
}

export default AuthFormMessageFallbackDemo
