import { createEffect, createSignal, type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { TabulatorTable } from '@/components/tabulator-table'
import {
  TanstackTable,
  TanstackTableHeader,
  TanstackTableBody,
  TanstackTableColumnHeader,
  TanstackTablePagination,
  TanstackTableProvider,
  createSolidTable,
  createSelectColumn,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@/components/tanstack-table'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@/components/tanstack-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { IconInbox } from '@/components/icons'
import { DataTable } from '@/hoc/data-table'
import { DataTableToolbar } from '@/hoc/data-table-toolbar'
import { EmptyState } from '@/hoc/empty-state'
import { PageLayout } from '../components/PageLayout'
import { MoreIcon } from '../components/icons'
import { type Tabulator } from 'tabulator-tables'

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  name: string
}

const payments: Payment[] = [
  { id: 'pay_001', amount: 316.0, status: 'success', email: 'ken99@yahoo.com', name: 'Ken Adams' },
  {
    id: 'pay_002',
    amount: 242.0,
    status: 'success',
    email: 'abe45@gmail.com',
    name: 'Abe Lincoln',
  },
  {
    id: 'pay_003',
    amount: 837.0,
    status: 'processing',
    email: 'monserrat44@gmail.com',
    name: 'Monserrat Ruiz',
  },
  {
    id: 'pay_004',
    amount: 874.0,
    status: 'success',
    email: 'silas22@gmail.com',
    name: 'Silas Johnson',
  },
  {
    id: 'pay_005',
    amount: 721.0,
    status: 'failed',
    email: 'carmella@hotmail.com',
    name: 'Carmella Davis',
  },
  {
    id: 'pay_006',
    amount: 150.0,
    status: 'pending',
    email: 'oliver.smith@mail.com',
    name: 'Oliver Smith',
  },
  {
    id: 'pay_007',
    amount: 499.0,
    status: 'success',
    email: 'emma.w@gmail.com',
    name: 'Emma Wilson',
  },
  {
    id: 'pay_008',
    amount: 320.0,
    status: 'processing',
    email: 'liam.b@yahoo.com',
    name: 'Liam Brown',
  },
  {
    id: 'pay_009',
    amount: 95.0,
    status: 'failed',
    email: 'sophia.j@mail.com',
    name: 'Sophia Jones',
  },
  {
    id: 'pay_010',
    amount: 610.0,
    status: 'success',
    email: 'noah.m@gmail.com',
    name: 'Noah Miller',
  },
  {
    id: 'pay_011',
    amount: 450.0,
    status: 'pending',
    email: 'ava.d@hotmail.com',
    name: 'Ava Davis',
  },
  {
    id: 'pay_012',
    amount: 780.0,
    status: 'success',
    email: 'jackson.w@mail.com',
    name: 'Jackson White',
  },
  {
    id: 'pay_013',
    amount: 125.0,
    status: 'processing',
    email: 'mia.t@gmail.com',
    name: 'Mia Taylor',
  },
  {
    id: 'pay_014',
    amount: 990.0,
    status: 'success',
    email: 'lucas.a@yahoo.com',
    name: 'Lucas Anderson',
  },
  {
    id: 'pay_015',
    amount: 55.0,
    status: 'failed',
    email: 'harper.g@mail.com',
    name: 'Harper Garcia',
  },
  {
    id: 'pay_016',
    amount: 340.0,
    status: 'pending',
    email: 'ethan.m@gmail.com',
    name: 'Ethan Martinez',
  },
  {
    id: 'pay_017',
    amount: 670.0,
    status: 'success',
    email: 'amelia.r@hotmail.com',
    name: 'Amelia Robinson',
  },
  {
    id: 'pay_018',
    amount: 200.0,
    status: 'processing',
    email: 'mason.c@mail.com',
    name: 'Mason Clark',
  },
  {
    id: 'pay_019',
    amount: 415.0,
    status: 'success',
    email: 'ella.l@gmail.com',
    name: 'Ella Lewis',
  },
  { id: 'pay_020', amount: 88.0, status: 'failed', email: 'james.h@yahoo.com', name: 'James Hall' },
]

const paymentColumns: ColumnDef<Payment>[] = [
  createSelectColumn<Payment>(),
  {
    accessorKey: 'name',
    header: ({ column }) => <TanstackTableColumnHeader column={column} title="Name" />,
    cell: info => <span class="font-medium">{info.getValue() as string}</span>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <TanstackTableColumnHeader column={column} title="Email" />,
    cell: info => <span class="text-muted-foreground">{info.getValue() as string}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <TanstackTableColumnHeader column={column} title="Status" />,
    cell: info => {
      const status = info.getValue() as Payment['status']
      const variant =
        status === 'success'
          ? 'default'
          : status === 'processing'
            ? 'secondary'
            : status === 'pending'
              ? 'outline'
              : 'destructive'
      return <Badge variant={variant}>{status}</Badge>
    },
    filterFn: 'equals',
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <TanstackTableColumnHeader column={column} title="Amount" />,
    cell: info => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(info.getValue() as number)
      return <span class="font-tabular-nums">{formatted}</span>
    },
  },
  {
    id: 'actions',
    header: () => <span class="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger as={Button} variant="ghost" size="icon-sm">
          <MoreIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => navigator.clipboard.writeText(row.original.id)}>
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
]

const TablesPage: Component = () => {
  const [tabulator, setTabulator] = createSignal<Tabulator | undefined>()
  const [dataTableLoading, setDataTableLoading] = createSignal(false)

  const [sorting, setSorting] = createSignal<SortingState>([])
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({})

  const tanstackTable = createSolidTable({
    get data() {
      return payments
    },
    columns: paymentColumns,
    state: {
      get sorting() {
        return sorting()
      },
      get columnFilters() {
        return columnFilters()
      },
      get columnVisibility() {
        return columnVisibility()
      },
      get rowSelection() {
        return rowSelection()
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  })

  createEffect(() => {
    const table = tabulator()
    if (!table) return
    table.on('rowSelected', row => row.getElement().classList.add('bg-muted'))
    table.on('rowDeselected', row => row.getElement().classList.remove('bg-muted'))
  })

  return (
    <PageLayout
      title="Tables"
      description="Advanced table components: DataTable HOC, TabulatorTable, TanStack Table."
    >
      {/* DataTable HOC */}
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>DataTable HOC</CardTitle>
              <CardDescription>
                Full-featured table with toolbar, pagination, loading skeleton & empty state.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDataTableLoading(true)
                setTimeout(() => setDataTableLoading(false), 2000)
              }}
            >
              Toggle Loading
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={paymentColumns}
            data={payments}
            loading={dataTableLoading()}
            searchColumn="name"
            actions={
              <Button variant="outline" size="sm">
                Export
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* TanStack Table */}
      <TanstackTableProvider table={tanstackTable}>
        <Card>
          <CardHeader>
            <CardTitle>TanStack Table</CardTitle>
            <CardDescription>
              Powered by @tanstack/solid-table with sorting, filtering, pagination, and row
              selection.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <DataTableToolbar
              table={tanstackTable}
              searchColumn="name"
              locale={{ searchPlaceholder: 'Filter by name...' }}
              actions={
                <Button variant="outline" size="sm">
                  Export
                </Button>
              }
            />
            <TanstackTable>
              <TanstackTableHeader />
              <TanstackTableBody
                emptyContent={
                  <EmptyState
                    icon={<IconInbox class="size-10" />}
                    title="No payments found"
                    description="Try adjusting your filters"
                  />
                }
              />
            </TanstackTable>
            <TanstackTablePagination pageSizeOptions={[5, 10, 20]} />
          </CardContent>
        </Card>
      </TanstackTableProvider>

      {/* Tabulator Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabulator Table</CardTitle>
          <CardDescription>
            Rich spreadsheet-like table with editing, selection, and pagination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabulatorTable
            initOptions={{
              layout: 'fitColumns',
              reactiveData: true,
              pagination: true,
              paginationSize: 6,
              paginationSizeSelector: [3, 6, 8, 10],
              movableColumns: true,
              paginationCounter: 'rows',
              rowHeight: 49,
              selectableRange: 1,
              selectableRangeColumns: true,
              selectableRangeRows: true,
              selectableRangeClearCells: true,
              editTriggerEvent: 'dblclick',
              rowHeader: {
                resizable: false,
                frozen: true,
                width: 40,
                hozAlign: 'center',
                formatter: 'rownum',
              },
              columns: [
                { title: 'Name', field: 'name', sorter: 'string', width: 200 },
                { title: 'Progress', field: 'progress', sorter: 'number', formatter: 'progress' },
                {
                  title: 'Gender',
                  field: 'gender',
                  sorter: 'string',
                  editor: 'list',
                  editorParams: {
                    values: [
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ],
                  },
                },
                {
                  title: 'Rating',
                  field: 'rating',
                  formatter: 'star',
                  hozAlign: 'center',
                  width: 100,
                },
                { title: 'Favourite Color', field: 'col', sorter: 'string' },
              ],
              data: [
                { id: 1, name: 'Oli Bob', progress: 12, gender: 'male', rating: 1, col: 'red' },
                { id: 2, name: 'Mary May', progress: 1, gender: 'female', rating: 2, col: 'blue' },
                {
                  id: 3,
                  name: 'Christine Lobowski',
                  progress: 42,
                  gender: 'female',
                  rating: 0,
                  col: 'green',
                },
                {
                  id: 4,
                  name: 'Brendon Philips',
                  progress: 100,
                  gender: 'male',
                  rating: 1,
                  col: 'orange',
                },
                {
                  id: 5,
                  name: 'Margret Marmajuke',
                  progress: 16,
                  gender: 'female',
                  rating: 5,
                  col: 'yellow',
                },
              ],
            }}
            onInit={setTabulator}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default TablesPage
