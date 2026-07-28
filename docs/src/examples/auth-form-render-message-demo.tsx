import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import { Button } from 'shadcn-solid-components/components/button'
import { IconAlertTriangle, IconCircleCheck } from 'shadcn-solid-components/components/icons'
import {
  AuthForm,
  type AuthFormMessage,
  type AuthSubmitPayload,
} from 'shadcn-solid-components/hoc/auth-form'
import { createSignal, Show } from 'solid-js'

const AuthFormRenderMessageDemo = () => {
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
      setMessage({ type: 'success', content: 'Signed in successfully. Redirecting...' })
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
              setMessage({
                type: 'warning',
                content: 'Too many attempts. Try again in 10 minutes.',
              })
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
        renderMessage={current => (
          <Alert variant={current.type === 'error' || !current.type ? 'destructive' : current.type}>
            <Show when={current.type === 'error' || current.type === 'warning'}>
              <IconAlertTriangle />
            </Show>
            <Show when={current.type === 'success'}>
              <IconCircleCheck />
            </Show>
            <AlertTitle>
              {current.type === 'success'
                ? 'Success'
                : current.type === 'warning'
                  ? 'Warning'
                  : 'Error'}
            </AlertTitle>
            <AlertDescription>{current.content}</AlertDescription>
          </Alert>
        )}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AuthFormRenderMessageDemo
