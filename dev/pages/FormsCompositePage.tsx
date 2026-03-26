import { type Component, createSignal } from 'solid-js'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { IconBrandGithub, IconBrandGoogle } from '@/components/icons'
import { TextField, TextFieldInput } from '@/components/text-field'
import { FileUploadZone, type UploadFile } from '@/hoc/file-upload-zone'
import { FilterBuilder, type FilterRule } from '@/hoc/filter-builder'
import { FormField } from '@/hoc/form-field'
import { LoginForm } from '@/hoc/login-form'
import { TagInput } from '@/hoc/tag-input'
import { useNotify } from '@/hoc/use-notify'
import { PageLayout } from '../components/PageLayout'

const FormsCompositePage: Component = () => {
  const notify = useNotify({ position: 'bottom-right' })
  const [tags, setTags] = createSignal<string[]>(['SolidJS', 'TypeScript'])
  const [filterRules, setFilterRules] = createSignal<FilterRule[]>([])
  const [loginMode, setLoginMode] = createSignal<'login' | 'register'>('login')
  const [uploadedFiles, setUploadedFiles] = createSignal<UploadFile[]>([])

  return (
    <PageLayout
      title="Form Composites"
      description="High-level form components: FormField, TagInput, FilterBuilder, LoginForm, FileUploadZone."
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

      {/* LoginForm */}
      <Card>
        <CardHeader>
          <CardTitle>Login Form</CardTitle>
          <CardDescription>
            Pre-built authentication form with social providers and mode switching.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center py-6">
          <LoginForm
            mode={loginMode()}
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
            forgotPasswordHref="#"
            onSubmit={data =>
              notify.success(
                `${loginMode() === 'login' ? 'Signed in' : 'Registered'} as ${data.email}`,
              )
            }
            onModeSwitch={() => setLoginMode(m => (m === 'login' ? 'register' : 'login'))}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default FormsCompositePage
