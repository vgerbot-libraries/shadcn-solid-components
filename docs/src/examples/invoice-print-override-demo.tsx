import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import { Invoice } from 'shadcn-solid-components/hoc/invoice'
import { createSignal } from 'solid-js'

const InvoicePrintOverrideDemo = () => {
  const [message, setMessage] = createSignal('Click Print to trigger onPrint override.')

  return (
    <div class="space-y-4">
      <Invoice
        invoiceNumber="INV-PRINT-3001"
        issueDate="2026-05-18"
        status="draft"
        paymentStatus="unpaid"
        issuer={{ name: 'Demo Studio' }}
        customer={{ name: 'Sandbox Client' }}
        items={[
          {
            quantity: 1,
            item: 'Consulting',
            description: 'Monthly advisory retainer',
            amount: 800,
          },
        ]}
        onPrint={() => {
          setMessage('onPrint returned false. Default window.print() was skipped.')
          return false
        }}
      />

      <Alert>
        <AlertTitle>Print callback result</AlertTitle>
        <AlertDescription>{message()}</AlertDescription>
      </Alert>
    </div>
  )
}

export default InvoicePrintOverrideDemo
