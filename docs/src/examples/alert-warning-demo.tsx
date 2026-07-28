import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import { IconAlertTriangle } from 'shadcn-solid-components/components/icons'

const AlertWarningDemo = () => {
  return (
    <Alert variant="warning">
      <IconAlertTriangle />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>You have used 90% of your storage quota.</AlertDescription>
    </Alert>
  )
}

export default AlertWarningDemo
