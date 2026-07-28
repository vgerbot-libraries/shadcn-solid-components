import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import { IconCircleCheck } from 'shadcn-solid-components/components/icons'

const AlertSuccessDemo = () => {
  return (
    <Alert variant="success">
      <IconCircleCheck />
      <AlertTitle>Payment received</AlertTitle>
      <AlertDescription>Your subscription has been renewed successfully.</AlertDescription>
    </Alert>
  )
}

export default AlertSuccessDemo
