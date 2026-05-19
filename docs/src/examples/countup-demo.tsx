import { Countup } from 'shadcn-solid-components/components/countup'

const metrics = [
  { label: 'Total Revenue', value: 1250000, format: 'currency' as const },
  { label: 'Active Users', value: 48720, format: 'number' as const },
  { label: 'Conversion Rate', value: 12.8, format: 'percent' as const },
  { label: 'Tickets Solved', value: 1342, format: 'number' as const },
]

const CountupDemo = () => {
  return (
    <div class="grid w-full gap-3 sm:grid-cols-2">
      {metrics.map(item => (
        <div class="rounded-lg border p-4">
          <div class="text-muted-foreground text-sm">{item.label}</div>
          <div class="mt-2 text-2xl font-semibold tabular-nums">
            {item.format === 'currency' && '$'}
            <Countup value={item.value} decimals={item.format === 'percent' ? 1 : 0} />
            {item.format === 'percent' && '%'}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CountupDemo
