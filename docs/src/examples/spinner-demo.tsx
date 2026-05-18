import { Spinner } from 'shadcn-solid-components/components/spinner'

const SpinnerDemo = () => {
  return (
    <div class="flex items-center gap-2 text-sm">
      <Spinner />
      <span>Loading...</span>
    </div>
  )
}

export default SpinnerDemo
