import { Countup } from 'shadcn-solid-components/components/countup'

const CountupFormatDemo = () => {
  return (
    <div class="grid w-full gap-3 sm:grid-cols-2">
      <div class="rounded-lg border p-4">
        <div class="text-muted-foreground text-sm">Custom Currency</div>
        <div class="mt-2 text-2xl font-semibold tabular-nums">
          <Countup
            value={523400}
            format={value => `US$ ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          />
        </div>
      </div>

      <div class="rounded-lg border p-4">
        <div class="text-muted-foreground text-sm">Compact K/M Format</div>
        <div class="mt-2 text-2xl font-semibold tabular-nums">
          <Countup
            value={1254000}
            format={value => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`
              }
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`
              }
              return value.toFixed(0)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CountupFormatDemo
