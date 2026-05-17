import { Watermark } from 'shadcn-solid-components/components/watermark'

const COMPANY_MARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='48' viewBox='0 0 120 48'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Crect width='120' height='48' rx='8' fill='rgba(29,78,216,0.12)'/%3E%3Cpath d='M22 14h9l7 10l7-10h9L41 34z' fill='rgba(29,78,216,0.5)'/%3E%3C/g%3E%3C/svg%3E"

const WatermarkImageDemo = () => {
  return (
    <Watermark image={COMPANY_MARK} width={120} height={48} gap={[96, 88]} rotate={-18}>
      <div class="rounded-component border bg-background p-6">
        <h3 class="text-base font-semibold">Internal operation center</h3>
        <p class="text-muted-foreground mt-2 text-sm leading-6">
          Use an image mark when your organization requires a branded anti-capture overlay across
          audit-sensitive pages.
        </p>
      </div>
    </Watermark>
  )
}

export default WatermarkImageDemo
