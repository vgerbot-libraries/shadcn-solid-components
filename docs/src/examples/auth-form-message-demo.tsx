import { Button } from 'shadcn-solid-components/components/button'
import {
  AuthForm,
  type AuthFormMessage,
  type AuthSubmitPayload,
} from 'shadcn-solid-components/hoc/auth-form'
import { createSignal } from 'solid-js'

const AuthFormMessageDemo = () => {
  const [message, setMessage] = createSignal<AuthFormMessage | null>(null)
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (payload: AuthSubmitPayload) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      if (payload.password !== 'password123') {
        setMessage({ type: 'error', content: 'Invalid email or password' })
        return
      }
      setMessage({ type: 'success', content: 'Signed in successfully' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="flex w-full flex-col gap-4">
      <div class="rounded-lg border p-3">
        <p class="mb-2 text-xs font-medium text-muted-foreground">External Controls</p>
        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage({ type: 'info', content: 'Your session expires in 5 minutes' })
            }
          >
            Show info
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage({ type: 'warning', content: 'Too many attempts. Try again later.' })
            }
          >
            Show warning
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setMessage(null)}>
            Clear
          </Button>
        </div>
      </div>

      <AuthForm
        enabledModes={['login']}
        enabledMethods={['password']}
        loading={loading()}
        message={message()}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AuthFormMessageDemo
