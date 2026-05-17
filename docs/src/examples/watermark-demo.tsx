import { Watermark } from 'shadcn-solid-components/components/watermark'

const WatermarkDemo = () => {
  return (
    <Watermark
      content={['Confidential', 'alice@acme.com']}
      gap={[80, 80]}
      font={{
        color: 'rgba(14, 24, 39, 0.18)',
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <div class="rounded-component border bg-background p-6">
        <h3 class="text-base font-semibold">Quarterly finance report</h3>
        <p class="text-muted-foreground mt-2 text-sm leading-6">
          Revenue, cash flow, and operating margin details appear in this panel. The watermark stays
          above content and helps trace screenshots.
        </p>
      </div>
    </Watermark>
  )
}

export default WatermarkDemo
