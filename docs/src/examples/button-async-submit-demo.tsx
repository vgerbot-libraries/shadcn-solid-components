import { Button } from 'shadcn-solid-components/components/button'
import { createSignal } from 'solid-js'

const ButtonAsyncSubmitDemo = () => {
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await new Promise(resolve => {
        setTimeout(resolve, 1200)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button loading={loading()} loadingText="Submitting..." onClick={handleSubmit}>
      Submit form
    </Button>
  )
}

export default ButtonAsyncSubmitDemo
