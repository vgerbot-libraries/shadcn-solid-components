import { Countup } from 'shadcn-solid-components/components/countup'

const CountupOnViewDemo = () => {
  return (
    <div class="h-56 w-full overflow-y-auto rounded-lg border p-4">
      <p class="text-muted-foreground text-sm">
        Scroll down to trigger countup when values enter view.
      </p>
      <div class="h-32" />
      <div class="space-y-3">
        <div class="rounded-lg border p-4">
          <div class="text-muted-foreground text-sm">Monthly Orders</div>
          <div class="mt-2 text-2xl font-semibold tabular-nums">
            <Countup value={8421} startOnView />
          </div>
        </div>
        <div class="rounded-lg border p-4">
          <div class="text-muted-foreground text-sm">MRR Growth</div>
          <div class="mt-2 text-2xl font-semibold tabular-nums">
            <Countup value={18.6} decimals={1} startOnView />%
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountupOnViewDemo
