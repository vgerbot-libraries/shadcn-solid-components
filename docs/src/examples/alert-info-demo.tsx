import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import { IconCircleHelp } from 'shadcn-solid-components/components/icons'

const AlertInfoDemo = () => {
  return (
    <Alert variant="info">
      <IconCircleHelp />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Your trial ends in 3 days. Upgrade to keep your data.</AlertDescription>
    </Alert>
  )
}

export default AlertInfoDemo
