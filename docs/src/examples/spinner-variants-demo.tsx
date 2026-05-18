import { Spinner, type SpinnerVariant } from 'shadcn-solid-components/components/spinner'
import { For } from 'solid-js'

const variants: SpinnerVariant[] = [
  'default',
  'throbber',
  'pinwheel',
  'circle-filled',
  'ellipsis',
  'bars',
  'orbital',
  'pulse',
  'cube-grid',
  'fading-circle',
  'folding-cube',
]

const SpinnerVariantsDemo = () => {
  return (
    <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
      <For each={variants}>
        {variant => (
          <div class="flex flex-col items-center gap-2 rounded-component border p-3 text-center text-xs">
            <Spinner variant={variant} class="size-6" aria-label={`Loading ${variant}`} />
            <span class="font-mono">{variant}</span>
          </div>
        )}
      </For>
    </div>
  )
}

export default SpinnerVariantsDemo
