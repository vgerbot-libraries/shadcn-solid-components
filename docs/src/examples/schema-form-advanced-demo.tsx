import {
  SchemaForm,
  type SchemaFormObject,
  type SchemaFormSchema,
  type SchemaFormValidationResult,
} from 'shadcn-solid-components/hoc/schema-form'
import { createSignal } from 'solid-js'

const advancedSchema: SchemaFormSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      title: 'Profile',
      properties: {
        fullName: {
          type: 'string',
          title: 'Full Name',
          minLength: 2,
        },
        title: {
          type: 'string',
          title: 'Job Title',
        },
        website: {
          type: 'string',
          title: 'Website',
          format: 'url',
          'x-ui:placeholder': 'https://example.com',
        },
      },
      required: ['fullName'],
    },
    contacts: {
      type: 'array',
      title: 'Contacts',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['email', 'phone'],
          },
          value: {
            type: 'string',
            title: 'Value',
            minLength: 3,
          },
          primary: {
            type: 'boolean',
            title: 'Primary',
            'x-ui:widget': 'checkbox',
          },
        },
        required: ['type', 'value'],
      },
    },
    notifications: {
      type: 'object',
      title: 'Notifications',
      properties: {
        email: {
          type: 'boolean',
          title: 'Email',
        },
        sms: {
          type: 'boolean',
          title: 'SMS',
          'x-ui:disabledWhen': { field: 'profile.title', equals: 'Intern' },
        },
      },
    },
  },
  required: ['profile', 'contacts'],
}

const zodLikeValidator = {
  safeParse(values: unknown) {
    const input = values as SchemaFormObject
    const profile =
      input.profile && typeof input.profile === 'object' && !Array.isArray(input.profile)
        ? (input.profile as Record<string, unknown>)
        : undefined
    const issues: Array<{ path: Array<string | number>; message: string }> = []

    if (typeof profile?.fullName === 'string' && profile.fullName.split(' ').length < 2) {
      issues.push({
        path: ['profile', 'fullName'],
        message: 'Please provide both first and last name.',
      })
    }

    if (Array.isArray(input.contacts)) {
      const hasPrimary = input.contacts.some(contact => {
        if (!contact || typeof contact !== 'object') return false
        return Boolean((contact as Record<string, unknown>).primary)
      })

      if (!hasPrimary) {
        issues.push({
          path: ['contacts'],
          message: 'At least one contact must be marked as primary.',
        })
      }
    }

    return {
      success: issues.length === 0,
      error: issues.length ? { issues } : undefined,
    }
  },
}

const SchemaFormAdvancedDemo = () => {
  const [values, setValues] = createSignal<SchemaFormObject>({
    contacts: [{ type: 'email', value: '', primary: true }],
    profile: { fullName: '', title: '', website: '' },
    notifications: { email: true, sms: false },
  })
  const [status, setStatus] = createSignal('')

  return (
    <div class="space-y-4">
      <SchemaForm
        schema={advancedSchema}
        value={values()}
        onChange={setValues}
        zodSchema={zodLikeValidator}
        onValidate={nextValues => {
          const output: SchemaFormValidationResult = { valid: true }
          const profile =
            nextValues.profile &&
            typeof nextValues.profile === 'object' &&
            !Array.isArray(nextValues.profile)
              ? (nextValues.profile as Record<string, unknown>)
              : undefined

          if (
            typeof profile?.website === 'string' &&
            profile.website.length > 0 &&
            !profile.website.startsWith('https://')
          ) {
            output.valid = false
            output.errors = {
              'profile.website': 'Website must start with https://',
            }
          }
          return output
        }}
        onSubmit={nextValues => {
          setStatus(
            `Submitted at ${new Date().toLocaleTimeString()}\n${JSON.stringify(nextValues, null, 2)}`,
          )
        }}
      />

      <pre class="bg-muted rounded-component overflow-auto p-3 text-xs">
        {status() || 'No submit yet.'}
      </pre>
    </div>
  )
}

export default SchemaFormAdvancedDemo
