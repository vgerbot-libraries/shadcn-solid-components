import { type Component, createMemo, createSignal } from 'solid-js'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { QrCode } from 'shadcn-solid-components/components/qr-code'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { PageLayout } from '../components/PageLayout'

const QrCodePage: Component = () => {
  const [value, setValue] = createSignal(
    'https://github.com/vgerbot-libraries/shadcn-solid-components',
  )
  const [size, setSize] = createSignal(220)

  const sizeLabel = createMemo(() => `${size()} px`)

  return (
    <PageLayout
      title="QR Code"
      description="Generate stylized SVG QR codes for links, IDs, and app-specific payloads."
    >
      <Card>
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>
            Update content and size, then preview the generated code.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium" for="qr-code-value">
                Value
              </label>
              <TextField>
                <TextFieldInput
                  id="qr-code-value"
                  value={value()}
                  onInput={e => setValue(e.currentTarget.value)}
                  placeholder="Enter URL or text"
                />
              </TextField>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium" for="qr-code-size">
                  Size
                </label>
                <span class="text-muted-foreground text-xs">{sizeLabel()}</span>
              </div>
              <input
                id="qr-code-size"
                type="range"
                min="120"
                max="360"
                step="4"
                value={size()}
                class="accent-primary w-full"
                onInput={e => setSize(Number(e.currentTarget.value))}
              />
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setValue(
                    'otpauth://totp/Example:alice@sample.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
                  )
                }
              >
                OTP URI
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setValue('WIFI:T:WPA;S:Office-WiFi;P:supersecret123;H:false;;')}
              >
                Wi-Fi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setValue(
                    'BEGIN:VCARD\nFN:Jane Doe\nORG:Acme Inc\nTEL:+1-555-0100\nEMAIL:jane@example.com\nEND:VCARD',
                  )
                }
              >
                vCard
              </Button>
            </div>
          </div>

          <div class="bg-muted/30 flex items-center justify-center rounded-xl border p-6">
            <QrCode value={value()} size={size()} class="max-w-full" />
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
            <CardDescription>
              Uses foreground and background CSS variables by default.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex items-center justify-center rounded-lg border border-dashed p-6">
            <QrCode value="Theme aware QR code" size={180} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Colors</CardTitle>
            <CardDescription>Override module and background colors.</CardDescription>
          </CardHeader>
          <CardContent class="flex items-center justify-center rounded-lg border border-dashed p-6">
            <QrCode
              value="custom-colors"
              size={180}
              fgColor="var(--primary)"
              bgColor="var(--muted)"
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default QrCodePage
