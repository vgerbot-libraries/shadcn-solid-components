import { type Component, createSignal } from 'solid-js'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { IconBrandGithub, IconBrandGoogle } from 'shadcn-solid-components/components/icons'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import {
  AuthForm,
  type AuthMethod,
  type AuthMode,
} from 'shadcn-solid-components/hoc/auth-form'
import { FileUploadZone, type UploadFile } from 'shadcn-solid-components/hoc/file-upload-zone'
import { FilterBuilder, type FilterRule } from 'shadcn-solid-components/hoc/filter-builder'
import { FormField } from 'shadcn-solid-components/hoc/form-field'
import { TagInput } from 'shadcn-solid-components/hoc/tag-input'
import { useNotify } from 'shadcn-solid-components/hoc/use-notify'
import { PageLayout } from '../components/PageLayout'

const FormsCompositePage: Component = () => {
  const notify = useNotify({ position: 'bottom-right' })
  const [tags, setTags] = createSignal<string[]>(['SolidJS', 'TypeScript'])
  const [filterRules, setFilterRules] = createSignal<FilterRule[]>([])
  const [authMode, setAuthMode] = createSignal<AuthMode>('login')
  const [authMethod, setAuthMethod] = createSignal<AuthMethod>('password')
  const [uploadedFiles, setUploadedFiles] = createSignal<UploadFile[]>([])

  return (
    <PageLayout
      title="Form Composites"
      description="High-level form components: FormField, TagInput, FilterBuilder, AuthForm, FileUploadZone."
    >
      {/* FormField */}
      <Card>
        <CardHeader>
          <CardTitle>Form Field</CardTitle>
          <CardDescription>Unified label + input + error + description wrapper.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4 max-w-md">
          <FormField label="Username" required description="This will be your public display name.">
            <TextField>
              <TextFieldInput placeholder="Enter username" />
            </TextField>
          </FormField>
          <FormField label="Email" required error="Please enter a valid email address.">
            <TextField validationState="invalid">
              <TextFieldInput type="email" placeholder="you@example.com" />
            </TextField>
          </FormField>
          <FormField label="Bio" description="Tell us about yourself.">
            <TextField>
              <TextFieldInput placeholder="Optional bio" />
            </TextField>
          </FormField>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* TagInput */}
        <Card>
          <CardHeader>
            <CardTitle>Tag Input</CardTitle>
            <CardDescription>Multi-tag input with autocomplete suggestions.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <TagInput
              value={tags()}
              onChange={setTags}
              suggestions={[
                'SolidJS',
                'TypeScript',
                'React',
                'Vue',
                'Svelte',
                'Angular',
                'Tailwind',
                'Vite',
              ]}
              max={6}
              placeholder="Add a framework..."
            />
            <p class="text-muted-foreground text-sm">Current tags: {tags().join(', ') || 'none'}</p>
          </CardContent>
        </Card>

        {/* FilterBuilder */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Builder</CardTitle>
            <CardDescription>Composable filter rules: field + operator + value.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <FilterBuilder
              fields={[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number' },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Success', value: 'success' },
                    { label: 'Failed', value: 'failed' },
                  ],
                },
                { key: 'date', label: 'Date', type: 'date' },
              ]}
              value={filterRules()}
              onChange={setFilterRules}
              maxRules={5}
            />
            <p class="text-muted-foreground text-sm">Active rules: {filterRules().length}</p>
          </CardContent>
        </Card>
      </div>

      {/* FileUploadZone */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload Zone</CardTitle>
          <CardDescription>
            Drag-and-drop file upload with validation, preview and progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadZone
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024}
            maxFiles={3}
            value={uploadedFiles()}
            onFilesAdd={files => {
              const newFiles: UploadFile[] = files.map(f => ({
                file: f,
                id: `${Date.now()}-${f.name}`,
                status: 'done' as const,
                preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
              }))
              setUploadedFiles(prev => [...prev, ...newFiles])
            }}
            onRemove={file => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
          />
        </CardContent>
      </Card>

      {/* AuthForm */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Form</CardTitle>
          <CardDescription>
            Unified authentication form with external mode and method controls.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col items-center gap-4 py-6">
          <div class="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={authMode() === 'login' ? 'default' : 'outline'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authMode() === 'register' ? 'default' : 'outline'}
              onClick={() => setAuthMode('register')}
            >
              Register
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authMode() === 'reset' ? 'default' : 'outline'}
              onClick={() => setAuthMode('reset')}
            >
              Reset
            </Button>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={authMethod() === 'password' ? 'secondary' : 'outline'}
              onClick={() => setAuthMethod('password')}
            >
              Password
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authMethod() === 'phone-otp' ? 'secondary' : 'outline'}
              onClick={() => setAuthMethod('phone-otp')}
            >
              Phone OTP
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authMethod() === 'email-otp' ? 'secondary' : 'outline'}
              onClick={() => setAuthMethod('email-otp')}
            >
              Email OTP
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authMethod() === 'oauth' ? 'secondary' : 'outline'}
              onClick={() => setAuthMethod('oauth')}
            >
              OAuth
            </Button>
          </div>

          <AuthForm
            mode={authMode()}
            method={authMethod()}
            providers={[
              {
                name: 'Google',
                icon: <IconBrandGoogle class="size-4" />,
                onSelect: () => notify.info('Google sign-in'),
              },
              {
                name: 'GitHub',
                icon: <IconBrandGithub class="size-4" />,
                onSelect: () => notify.info('GitHub sign-in'),
              },
            ]}
            onModeChange={next => setAuthMode(next)}
            onMethodChange={next => setAuthMethod(next)}
            onSendOtp={async () => {
              await Promise.resolve()
              notify.success('OTP sent')
            }}
            onVerifyOtp={async payload => {
              await Promise.resolve(payload)
              return payload.otpCode === '123456'
            }}
            onSubmit={data => {
              notify.success(`Auth submitted: ${data.mode} / ${data.method}`)
            }}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default FormsCompositePage
