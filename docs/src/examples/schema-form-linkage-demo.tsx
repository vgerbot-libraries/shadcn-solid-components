import {
  SchemaForm,
  type SchemaFormObject,
  type SchemaFormOption,
  type SchemaFormSchema,
} from 'shadcn-solid-components/hoc/schema-form'
import { createSignal } from 'solid-js'

const linkageSchema: SchemaFormSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    accountType: {
      type: 'string',
      title: 'Account Type',
      enum: ['personal', 'business'],
      'x-ui:widget': 'radio',
    },
    companyName: {
      type: 'string',
      title: 'Company Name',
      'x-ui:visibleWhen': { field: 'accountType', equals: 'business' },
      'x-ui:requiredWhen': { field: 'accountType', equals: 'business' },
      'x-ui:placeholder': 'Enter company name',
    },
    country: {
      type: 'string',
      title: 'Country',
      enum: ['US', 'CN', 'JP'],
    },
    region: {
      type: 'string',
      title: 'Region / State',
      'x-ui:optionsSource': 'regionOptions',
      'x-ui:dependsOn': ['country'],
      'x-ui:placeholder': 'Select a region',
    },
    receiveSms: {
      type: 'boolean',
      title: 'Receive SMS notifications',
      'x-ui:widget': 'switch',
    },
    phone: {
      type: 'string',
      title: 'Phone Number',
      'x-ui:visibleWhen': { field: 'receiveSms', truthy: true },
      'x-ui:requiredWhen': { field: 'receiveSms', truthy: true },
      'x-ui:placeholder': '+1 555 123 4567',
    },
  },
  required: ['accountType', 'country'],
}

const regionMap: Record<string, SchemaFormOption[]> = {
  US: [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
    { label: 'Washington', value: 'WA' },
  ],
  CN: [
    { label: 'Beijing', value: 'BJ' },
    { label: 'Shanghai', value: 'SH' },
    { label: 'Shenzhen', value: 'SZ' },
  ],
  JP: [
    { label: 'Tokyo', value: 'TK' },
    { label: 'Osaka', value: 'OS' },
    { label: 'Fukuoka', value: 'FK' },
  ],
}

const SchemaFormLinkageDemo = () => {
  const [values, setValues] = createSignal<SchemaFormObject>({
    accountType: 'personal',
    country: 'US',
  })

  return (
    <div class="space-y-4">
      <SchemaForm
        schema={linkageSchema}
        value={values()}
        onChange={setValues}
        optionLoaders={{
          regionOptions: async ({ values: nextValues }) => {
            await new Promise(resolve => setTimeout(resolve, 200))
            const country = String(nextValues.country ?? '')
            return regionMap[country] ?? []
          },
        }}
        showSubmitButton={false}
      />

      <pre class="bg-muted rounded-component overflow-auto p-3 text-xs">
        {JSON.stringify(values(), null, 2)}
      </pre>
    </div>
  )
}

export default SchemaFormLinkageDemo
