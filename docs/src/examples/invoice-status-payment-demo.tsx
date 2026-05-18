import { Badge } from 'shadcn-solid-components/components/badge'
import { Invoice } from 'shadcn-solid-components/hoc/invoice'

const InvoiceStatusPaymentDemo = () => {
  return (
    <Invoice
      title="Enterprise Invoice"
      invoiceNumber="INV-ENT-2048"
      issueDate="2026-05-01"
      dueDate="2026-05-31"
      status="overdue"
      paymentStatus="unpaid"
      paymentMethod="Wire Transfer"
      paymentReference="WIRE-PENDING-2048"
      issuer={{
        name: 'Northwind Systems',
        addressLines: ['88 Mission Street', 'Seattle, WA 98101'],
        email: 'ar@northwind.dev',
      }}
      customer={{
        name: 'Globex Corporation',
        addressLines: ['2200 Harbor Blvd', 'Los Angeles, CA 90015'],
        email: 'ap@globex.com',
      }}
      meta={[
        {
          label: 'Contract',
          value: 'ENT-2026-041',
        },
        {
          label: 'Priority',
          value: <Badge variant="destructive">Urgent</Badge>,
        },
      ]}
      items={[
        {
          quantity: 10,
          item: 'Dedicated Seats',
          sku: 'SEAT-ENT',
          description: 'Annual enterprise seats',
          amount: 3000,
        },
        {
          quantity: 1,
          item: 'Migration Service',
          sku: 'SERV-MIG',
          description: 'Data import and onboarding',
          amount: 1200,
        },
      ]}
      totals={{
        tax: 252,
        discount: 200,
        amountPaid: 0,
      }}
      notes="Escalate to account manager if unpaid beyond 7 days."
      paymentDetails={
        <div class="space-y-1">
          <p>Beneficiary: Northwind Systems LLC</p>
          <p>Bank: JP Morgan Chase</p>
          <p>SWIFT: CHASUS33</p>
        </div>
      }
    />
  )
}

export default InvoiceStatusPaymentDemo
