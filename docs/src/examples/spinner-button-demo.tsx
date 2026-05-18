import { Button } from 'shadcn-solid-components/components/button'
import { Spinner } from 'shadcn-solid-components/components/spinner'

const SpinnerButtonDemo = () => {
  return (
    <Button disabled size="sm" variant="outline">
      <Spinner class="mr-2" />
      Please wait
    </Button>
  )
}

export default SpinnerButtonDemo
