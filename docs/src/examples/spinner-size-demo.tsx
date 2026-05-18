import { Spinner } from 'shadcn-solid-components/components/spinner'

const SpinnerSizeDemo = () => {
  return (
    <div class="flex items-center gap-3">
      <Spinner class="size-3" aria-label="Loading small" />
      <Spinner class="size-4" aria-label="Loading default" />
      <Spinner class="size-5" aria-label="Loading medium" />
      <Spinner class="size-6" aria-label="Loading large" />
    </div>
  )
}

export default SpinnerSizeDemo
