import { createSignal } from "solid-js"

import { OTPFieldGroup } from "shadcn-solid-components/hoc/otp-field"

const OTPFieldGroupDemo = () => {
  const [code, setCode] = createSignal("")
  const [error, setError] = createSignal<string>()

  return (
    <OTPFieldGroup
      maxLength={6}
      label="Verification code"
      value={code()}
      onValueChange={(value) => {
        setCode(value)
        setError(undefined)
      }}
      onComplete={(value) => {
        if (value !== "123456") setError("The verification code is incorrect")
      }}
      error={error()}
      required
    />
  )
}

export default OTPFieldGroupDemo
