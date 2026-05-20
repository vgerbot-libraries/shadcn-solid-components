import {
  SchemaForm,
  type SchemaFormObject,
  type SchemaFormSchema,
} from 'shadcn-solid-components/hoc/schema-form'
import { createSignal } from 'solid-js'

const basicSchema: SchemaFormSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      minLength: 2,
      'x-ui:placeholder': 'Enter your full name',
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      'x-ui:placeholder': 'you@example.com',
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 18,
      maximum: 80,
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['Engineer', 'Designer', 'Product Manager', 'Ops'],
      'x-ui:placeholder': 'Select a role',
    },
    newsletter: {
      type: 'boolean',
      title: 'Subscribe to newsletter',
      'x-ui:widget': 'checkbox',
    },
  },
  required: ['name', 'email', 'role'],
}

const SchemaFormBasicDemo = () => {
  const [values, setValues] = createSignal<SchemaFormObject>({})
  const [submitted, setSubmitted] = createSignal('')

  return (
    <div class="space-y-4">
      <SchemaForm
        schema={basicSchema}
        value={values()}
        onChange={setValues}
        onSubmit={next => {
          setSubmitted(JSON.stringify(next, null, 2))
        }}
      />

      <pre class="bg-muted rounded-component overflow-auto p-3 text-xs">{submitted() || '{}'}</pre>
    </div>
  )
}

export default SchemaFormBasicDemo
