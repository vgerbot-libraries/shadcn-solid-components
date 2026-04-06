import { createSignal } from "solid-js"

import { LoginForm, type LoginFormMode } from "shadcn-solid-components/hoc/login-form"

const LoginFormDemo = () => {
  const [mode, setMode] = createSignal<LoginFormMode>("login")
  const [loading, setLoading] = createSignal(false)

  return (
    <LoginForm
      mode={mode()}
      loading={loading()}
      forgotPasswordHref="#"
      providers={[
        {
          name: "Google",
          icon: <span class="text-xs font-medium">G</span>,
          onSelect: () => {},
        },
      ]}
      onSubmit={(data) => {
        setLoading(true)
        void Promise.resolve(data).finally(() => setLoading(false))
      }}
      onModeSwitch={() => setMode(mode() === "login" ? "register" : "login")}
      footer={
        <p class="text-center text-xs text-muted-foreground">
          By continuing, you agree to the terms of service.
        </p>
      }
    />
  )
}

export default LoginFormDemo
