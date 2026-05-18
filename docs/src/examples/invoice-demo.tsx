import { Invoice } from 'shadcn-solid-components/hoc/invoice'

const InvoiceDemo = () => {
  return (
    <Invoice
      invoiceNumber="INV-2026-001"
      orderId="SO-78241"
      issueDate="2026-05-18"
      dueDate="2026-06-01"
      accountId="968-34567"
      status="sent"
      paymentStatus="partial"
      paymentMethod="Bank Transfer"
      paymentReference="TX-20260518-991"
      issuer={{
        name: 'Northbridge Studio LLC',
        addressLines: ['795 Folsom Ave, Suite 600', 'San Francisco, CA 94107'],
        phone: '(804) 123-5432',
        email: 'accounts@northbridge.studio',
      }}
      customer={{
        name: 'Acme Corp',
        addressLines: ['500 Market St', 'San Francisco, CA 94105'],
        phone: '(555) 539-1037',
        email: 'finance@acme.com',
      }}
      items={[
        {
          quantity: 1,
          item: 'Call of Duty',
          sku: '455-981-221',
          description: 'License purchase',
          amount: 64.5,
        },
        {
          quantity: 1,
          item: 'Need for Speed IV',
          sku: '247-925-726',
          description: 'License renewal',
          amount: 50,
        },
        {
          quantity: 1,
          item: 'Monsters DVD',
          sku: '735-845-642',
          description: 'Media package',
          amount: 10.7,
        },
      ]}
      totals={{
        tax: 10.34,
        shipping: 5.8,
        amountPaid: 50,
      }}
      notes="Thank you for your business."
      terms="Payment is due within 14 days."
      paymentDetails="Please transfer to Wells Fargo, Account 968-34567."
    />
  )
}

export default InvoiceDemo
