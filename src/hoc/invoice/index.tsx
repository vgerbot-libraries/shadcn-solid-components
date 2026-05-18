import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shadcn-solid-components/components/table'
import type { InvoiceLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export type InvoicePaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'

export interface InvoiceParty {
  name: string
  addressLines?: string[]
  phone?: string
  email?: string
  taxId?: string
  extra?: JSX.Element
}

export interface InvoiceLineItem {
  quantity: number
  item: string
  sku?: string
  description?: string
  amount: number
}

export interface InvoiceMetaItem {
  label: string
  value: string | number | JSX.Element
}

export interface InvoiceTotals {
  subTotal?: number
  tax?: number
  shipping?: number
  discount?: number
  total?: number
  amountPaid?: number
  amountDue?: number
}

export interface InvoiceProps extends ComponentProps<'div'> {
  title?: string
  issuer?: InvoiceParty
  customer?: InvoiceParty
  invoiceNumber?: string
  orderId?: string
  issueDate?: string
  dueDate?: string
  accountId?: string
  status?: InvoiceStatus | string
  paymentStatus?: InvoicePaymentStatus | string
  paymentMethod?: string
  paymentReference?: string
  paidAt?: string
  meta?: InvoiceMetaItem[]
  items: InvoiceLineItem[]
  currency?: string
  totals?: InvoiceTotals
  notes?: string | JSX.Element
  terms?: string | JSX.Element
  paymentDetails?: JSX.Element
  actions?: JSX.Element
  showPrintButton?: boolean
  onPrint?: () => boolean | void
  locale?: Partial<InvoiceLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function formatMoney(currency: string, value: number) {
  return `${currency}${value.toFixed(2)}`
}

function statusTone(value?: string) {
  switch (value) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
    case 'overdue':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
    case 'cancelled':
      return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
    default:
      return ''
  }
}

function createInvoicePrintStyle(printId: string) {
  return `
@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden !important;
  }

  [data-invoice-print-id="${printId}"],
  [data-invoice-print-id="${printId}"] * {
    visibility: visible !important;
  }

  [data-invoice-print-id="${printId}"] {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
  }

  [data-invoice-print-id="${printId}"] [data-slot="invoice-parties"] {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }

  [data-invoice-print-id="${printId}"] [data-slot="invoice-parties"] * {
    white-space: nowrap !important;
  }
}
`
}

function paymentTone(value?: string) {
  switch (value) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
    case 'partial':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
    case 'unpaid':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
    case 'refunded':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200'
    default:
      return ''
  }
}

// ============================================================================
// Component
// ============================================================================

export function Invoice(props: InvoiceProps) {
  const printId = `invoice-${Math.random().toString(36).slice(2)}`

  const [local, rest] = splitProps(props, [
    'class',
    'title',
    'issuer',
    'customer',
    'invoiceNumber',
    'orderId',
    'issueDate',
    'dueDate',
    'accountId',
    'status',
    'paymentStatus',
    'paymentMethod',
    'paymentReference',
    'paidAt',
    'meta',
    'items',
    'currency',
    'totals',
    'notes',
    'terms',
    'paymentDetails',
    'actions',
    'showPrintButton',
    'onPrint',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): InvoiceLocale => ({
    ...defaultLocale,
    ...globalLocale.Invoice,
    ...local.locale,
  })

  const currency = () => local.currency ?? '$'

  const subtotal = () =>
    local.totals?.subTotal ?? local.items.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const total = () =>
    local.totals?.total ??
    subtotal() +
      (local.totals?.tax ?? 0) +
      (local.totals?.shipping ?? 0) -
      (local.totals?.discount ?? 0)

  const amountDue = () =>
    local.totals?.amountDue ?? Math.max(total() - (local.totals?.amountPaid ?? 0), 0)

  const localizedStatus = () => {
    if (!local.status) return undefined
    const key = local.status as InvoiceStatus
    return locale().statuses[key] ?? local.status
  }

  const localizedPaymentStatus = () => {
    if (!local.paymentStatus) return undefined
    const key = local.paymentStatus as InvoicePaymentStatus
    return locale().paymentStatuses[key] ?? local.paymentStatus
  }

  const metaItems = () => {
    const baseItems: InvoiceMetaItem[] = []

    if (local.invoiceNumber) {
      baseItems.push({ label: locale().invoiceNumber, value: local.invoiceNumber })
    }

    if (local.orderId) {
      baseItems.push({ label: locale().orderId, value: local.orderId })
    }

    if (local.issueDate) {
      baseItems.push({ label: locale().issueDate, value: local.issueDate })
    }

    if (local.dueDate) {
      baseItems.push({ label: locale().dueDate, value: local.dueDate })
    }

    if (local.accountId) {
      baseItems.push({ label: locale().accountId, value: local.accountId })
    }

    if (local.status) {
      baseItems.push({
        label: locale().status,
        value: (
          <Badge variant="secondary" class={statusTone(local.status)}>
            {localizedStatus()}
          </Badge>
        ),
      })
    }

    if (local.paymentStatus) {
      baseItems.push({
        label: locale().paymentStatus,
        value: (
          <Badge variant="secondary" class={paymentTone(local.paymentStatus)}>
            {localizedPaymentStatus()}
          </Badge>
        ),
      })
    }

    if (local.paymentMethod) {
      baseItems.push({ label: locale().paymentMethod, value: local.paymentMethod })
    }

    if (local.paymentReference) {
      baseItems.push({ label: locale().paymentReference, value: local.paymentReference })
    }

    if (local.paidAt) {
      baseItems.push({ label: locale().paidAt, value: local.paidAt })
    }

    if (local.meta?.length) {
      baseItems.push(...local.meta)
    }

    return baseItems
  }

  const showPrintButton = () => local.showPrintButton !== false

  const handlePrint = () => {
    const result = local.onPrint?.()
    if (result === false) return

    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const style = document.createElement('style')
    style.textContent = createInvoicePrintStyle(printId)
    document.head.append(style)

    const mediaQuery =
      typeof window.matchMedia === 'function' ? window.matchMedia('print') : undefined

    const cleanup = () => {
      style.remove()
      mediaQuery?.removeEventListener('change', handleMediaChange)
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        cleanup()
      }
    }

    window.addEventListener('afterprint', cleanup, { once: true })
    mediaQuery?.addEventListener('change', handleMediaChange)

    window.print()
  }

  return (
    <div
      data-slot="invoice"
      data-invoice-print-id={printId}
      class={cx('w-full', local.class)}
      {...rest}
    >
      <Card class="print:shadow-none print:border-0">
        <CardHeader data-slot="invoice-header" class="space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <CardTitle class="text-2xl">{local.title ?? locale().title}</CardTitle>
            <Show when={local.invoiceNumber}>
              <div class="text-muted-foreground text-sm">
                {locale().invoiceNumber}:{' '}
                <span class="text-foreground font-medium">{local.invoiceNumber}</span>
              </div>
            </Show>
          </div>

          <div data-slot="invoice-parties" class="grid gap-4 md:grid-cols-3 print:grid-cols-3">
            <div class="space-y-1">
              <h3 class="text-muted-foreground text-sm font-medium">{locale().from}</h3>
              <Show when={local.issuer}>
                <div class="space-y-1 text-sm">
                  <p class="font-medium">{local.issuer?.name}</p>
                  <For each={local.issuer?.addressLines}>{line => <p>{line}</p>}</For>
                  <Show when={local.issuer?.phone}>
                    <p>{local.issuer?.phone}</p>
                  </Show>
                  <Show when={local.issuer?.email}>
                    <p>{local.issuer?.email}</p>
                  </Show>
                  <Show when={local.issuer?.taxId}>
                    <p>{local.issuer?.taxId}</p>
                  </Show>
                  <Show when={local.issuer?.extra}>{local.issuer?.extra}</Show>
                </div>
              </Show>
            </div>

            <div class="space-y-1">
              <h3 class="text-muted-foreground text-sm font-medium">{locale().to}</h3>
              <Show when={local.customer}>
                <div class="space-y-1 text-sm">
                  <p class="font-medium">{local.customer?.name}</p>
                  <For each={local.customer?.addressLines}>{line => <p>{line}</p>}</For>
                  <Show when={local.customer?.phone}>
                    <p>{local.customer?.phone}</p>
                  </Show>
                  <Show when={local.customer?.email}>
                    <p>{local.customer?.email}</p>
                  </Show>
                  <Show when={local.customer?.taxId}>
                    <p>{local.customer?.taxId}</p>
                  </Show>
                  <Show when={local.customer?.extra}>{local.customer?.extra}</Show>
                </div>
              </Show>
            </div>

            <div data-slot="invoice-meta" class="space-y-2 text-sm">
              <For each={metaItems()}>
                {item => (
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-muted-foreground">{item.label}</span>
                    <span class="text-right font-medium">{item.value}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </CardHeader>

        <CardContent data-slot="invoice-content" class="space-y-6">
          <div data-slot="invoice-items" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-16">{locale().quantity}</TableHead>
                  <TableHead>{locale().item}</TableHead>
                  <TableHead class="w-32">{locale().sku}</TableHead>
                  <TableHead>{locale().description}</TableHead>
                  <TableHead class="w-28 text-right">{locale().amount}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Show
                  when={local.items.length > 0}
                  fallback={
                    <TableRow>
                      <TableCell class="text-muted-foreground py-8 text-center" colSpan={5}>
                        {locale().noItems}
                      </TableCell>
                    </TableRow>
                  }
                >
                  <For each={local.items}>
                    {line => (
                      <TableRow>
                        <TableCell>{line.quantity}</TableCell>
                        <TableCell class="font-medium">{line.item}</TableCell>
                        <TableCell>{line.sku ?? '-'}</TableCell>
                        <TableCell class="text-muted-foreground whitespace-normal">
                          {line.description ?? '-'}
                        </TableCell>
                        <TableCell class="text-right font-medium">
                          {formatMoney(currency(), line.amount)}
                        </TableCell>
                      </TableRow>
                    )}
                  </For>
                </Show>
              </TableBody>
            </Table>
          </div>

          <div data-slot="invoice-summary" class="grid gap-6 md:grid-cols-2 print:grid-cols-2">
            <div class="space-y-4 text-sm">
              <Show when={local.paymentDetails}>
                <div>
                  <h4 class="mb-1.5 font-medium">{locale().paymentDetails}</h4>
                  <div class="text-muted-foreground">{local.paymentDetails}</div>
                </div>
              </Show>

              <Show when={local.notes}>
                <div>
                  <h4 class="mb-1.5 font-medium">{locale().notes}</h4>
                  <div class="text-muted-foreground">{local.notes}</div>
                </div>
              </Show>

              <Show when={local.terms}>
                <div>
                  <h4 class="mb-1.5 font-medium">{locale().terms}</h4>
                  <div class="text-muted-foreground">{local.terms}</div>
                </div>
              </Show>
            </div>

            <div class="ml-auto w-full max-w-sm space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">{locale().subTotal}</span>
                <span>{formatMoney(currency(), subtotal())}</span>
              </div>

              <Show when={local.totals?.tax !== undefined}>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">{locale().tax}</span>
                  <span>{formatMoney(currency(), local.totals?.tax ?? 0)}</span>
                </div>
              </Show>

              <Show when={local.totals?.shipping !== undefined}>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">{locale().shipping}</span>
                  <span>{formatMoney(currency(), local.totals?.shipping ?? 0)}</span>
                </div>
              </Show>

              <Show when={local.totals?.discount !== undefined}>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">{locale().discount}</span>
                  <span>-{formatMoney(currency(), local.totals?.discount ?? 0)}</span>
                </div>
              </Show>

              <div class="border-t pt-2">
                <div class="flex items-center justify-between text-base font-semibold">
                  <span>{locale().total}</span>
                  <span>{formatMoney(currency(), total())}</span>
                </div>
              </div>

              <Show when={local.totals?.amountPaid !== undefined}>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">{locale().amountPaid}</span>
                  <span>{formatMoney(currency(), local.totals?.amountPaid ?? 0)}</span>
                </div>

                <div class="flex items-center justify-between font-semibold">
                  <span>{locale().amountDue}</span>
                  <span>{formatMoney(currency(), amountDue())}</span>
                </div>
              </Show>
            </div>
          </div>
        </CardContent>

        <CardFooter data-slot="invoice-footer" class="print:hidden justify-end gap-2">
          <Show when={local.actions}>{local.actions}</Show>
          <Show when={showPrintButton()}>
            <Button type="button" onClick={handlePrint}>
              {locale().print}
            </Button>
          </Show>
        </CardFooter>
      </Card>
    </div>
  )
}
