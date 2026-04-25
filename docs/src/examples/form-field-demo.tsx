import { createSignal } from "solid-js"

import { TextField, TextFieldInput } from "shadcn-solid-components/components/text-field"
import { FormField } from "shadcn-solid-components/hoc/form-field"

const FormFieldDemo = () => {
  const [error, setError] = createSignal<string | undefined>()

  return (
    <FormField
      label="Email"
      required
      description="Used only for account notifications and never shown publicly."
      error={error()}
    >
      <TextField>
        <TextFieldInput
          type="email"
          name="email"
          autocomplete="email"
          onBlur={(e: any) => {
            const value = e.currentTarget.value.trim()
            setError(value ? undefined : "Please enter an email address")
          }}
        />
      </TextField>
    </FormField>
  )
}

export default FormFieldDemo
