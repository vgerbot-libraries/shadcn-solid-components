import { Alert, AlertDescription, AlertTitle } from "shadcn-solid-components/components/alert"

const AlertStaticDemo = () => {
  return (
    <Alert as="div">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This alert is purely informational, so it renders as a div instead of a
        button.
      </AlertDescription>
    </Alert>
  )
}

export default AlertStaticDemo
