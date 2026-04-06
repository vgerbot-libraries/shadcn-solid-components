import { VisArea, VisLine } from '@unovis/solid'
import { type Component, createEffect, createSignal, For } from 'solid-js'
import { type Tabulator } from 'tabulator-tables'
import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { ChartContainer, ChartCrosshair } from 'shadcn-solid-components/components/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'shadcn-solid-components/components/dropdown-menu'
import {
  IconBell,
  IconBrandGithub,
  IconBrandGoogle,
  IconCheck,
  IconCreditCard,
  IconInbox,
  IconLoader,
  IconMail,
  IconSettings,
  IconUser,
} from 'shadcn-solid-components/components/icons'
import { Separator } from 'shadcn-solid-components/components/separator'
import { SidebarTrigger } from 'shadcn-solid-components/components/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shadcn-solid-components/components/table'
import { TabulatorTable } from 'shadcn-solid-components/components/tabulator-table'
import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from 'shadcn-solid-components/components/tanstack-table'
import {
  createSelectColumn,
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TanstackTable,
  TanstackTableBody,
  TanstackTableColumnHeader,
  TanstackTableHeader,
  TanstackTablePagination,
  TanstackTableProvider,
} from 'shadcn-solid-components/components/tanstack-table'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { confirm } from 'shadcn-solid-components/hoc/confirm-dialog'
import { DataTable } from 'shadcn-solid-components/hoc/data-table'
import { DataTableToolbar } from 'shadcn-solid-components/hoc/data-table-toolbar'
import { DescriptionList } from 'shadcn-solid-components/hoc/description-list'
import { EmptyState } from 'shadcn-solid-components/hoc/empty-state'
import { FileUploadZone, type UploadFile } from 'shadcn-solid-components/hoc/file-upload-zone'
import { FilterBuilder, type FilterRule } from 'shadcn-solid-components/hoc/filter-builder'
import { FormField } from 'shadcn-solid-components/hoc/form-field'
import { LoginForm } from 'shadcn-solid-components/hoc/login-form'
import {
  NotificationCenter,
  type NotificationItem,
} from 'shadcn-solid-components/hoc/notification-center'
import { PageHeader } from 'shadcn-solid-components/hoc/page-header'
import { StatCard } from 'shadcn-solid-components/hoc/stat-card'
import { Stepper } from 'shadcn-solid-components/hoc/stepper'
import { TagInput } from 'shadcn-solid-components/hoc/tag-input'
import { Timeline } from 'shadcn-solid-components/hoc/timeline'
import { type TransferItem, TransferList } from 'shadcn-solid-components/hoc/transfer-list'
import { useNotify } from 'shadcn-solid-components/hoc/use-notify'
import { UserMenu } from 'shadcn-solid-components/hoc/user-menu'
import {
  ActiveAccountsIcon,
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
  GrowthRateIcon,
  MoreIcon,
  NewCustomersIcon,
  TotalRevenueIcon,
} from './icons'

// Chart data
const chartData = [
  { month: 'Jan', visitors: 186 },
  { month: 'Feb', visitors: 305 },
  { month: 'Mar', visitors: 237 },
  { month: 'Apr', visitors: 273 },
  { month: 'May', visitors: 209 },
  { month: 'Jun', visitors: 214 },
  { month: 'Jul', visitors: 314 },
  { month: 'Aug', visitors: 265 },
  { month: 'Sep', visitors: 287 },
  { month: 'Oct', visitors: 134 },
  { month: 'Nov', visitors: 189 },
  { month: 'Dec', visitors: 400 },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-1))',
  },
  month: {
    label: 'Month',
  },
}

type ChartDataPoint = (typeof chartData)[0]

// Table data
const tableData = [
  {
    header: 'Cover page',
    sectionType: 'Cover page',
    status: 'In Process',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Eddie Lake',
  },
  {
    header: 'Table of contents',
    sectionType: 'Table of contents',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Eddie Lake',
  },
  {
    header: 'Executive summary',
    sectionType: 'Narrative',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Eddie Lake',
  },
  {
    header: 'Technical approach',
    sectionType: 'Narrative',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    header: 'Design',
    sectionType: 'Narrative',
    status: 'In Process',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    header: 'Capabilities',
    sectionType: 'Narrative',
    status: 'In Process',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    header: 'Integration with existing systems',
    sectionType: 'Narrative',
    status: 'In Process',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    header: 'Innovation and Advantages',
    sectionType: 'Narrative',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Reviewer',
  },
  {
    header: "Overview of EMR's Innovative Solutions",
    sectionType: 'Technical content',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Reviewer',
  },
  {
    header: 'Advanced Algorithms and Machine Learning',
    sectionType: 'Narrative',
    status: 'Done',
    target: 'Target',
    limit: 'Limit',
    reviewer: 'Reviewer',
  },
]

// TanStack Table demo data
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
      const amount = info.getValue() as number
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
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

export const Main: Component = () => {
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set())

  const [tabulator, setTabulator] = createSignal<Tabulator | undefined>()

  // TanStack Table state
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
    if (!table) {
      return
    }
    table.on('rowSelected', row => {
      row.getElement().classList.add('bg-muted')
    })
    table.on('rowDeselected', row => {
      row.getElement().classList.remove('bg-muted')
    })
  })

  const toggleRow = (index: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const notify = useNotify({ position: 'bottom-right' })
  const [confirmResult, setConfirmResult] = createSignal('')

  // -- DataTable HOC demo (reuses paymentColumns) --
  const [dataTableLoading, setDataTableLoading] = createSignal(false)

  // -- Stepper demo --
  const [stepperActiveStep, setStepperActiveStep] = createSignal(0)

  // -- FileUploadZone demo --
  const [uploadedFiles, setUploadedFiles] = createSignal<UploadFile[]>([])

  // -- LoginForm demo --
  const [loginMode, setLoginMode] = createSignal<'login' | 'register'>('login')

  // -- TagInput demo --
  const [tags, setTags] = createSignal<string[]>(['SolidJS', 'TypeScript'])

  // -- TransferList demo --
  const transferSource: TransferItem[] = [
    { key: 'admin', label: 'Admin', description: 'Full access to all resources' },
    { key: 'editor', label: 'Editor', description: 'Can edit content' },
    { key: 'viewer', label: 'Viewer', description: 'Read-only access' },
    { key: 'moderator', label: 'Moderator', description: 'Can moderate content' },
    { key: 'contributor', label: 'Contributor', description: 'Can submit content' },
    { key: 'analyst', label: 'Analyst', description: 'Can view analytics' },
  ]
  const [transferTarget, setTransferTarget] = createSignal<string[]>(['admin'])

  // -- NotificationCenter demo --
  const [notifications, setNotifications] = createSignal<NotificationItem[]>([
    {
      id: '1',
      title: 'New comment on your post',
      description: 'Alice replied to your discussion about SolidJS performance.',
      time: '5 min ago',
      category: 'messages',
      icon: <IconMail class="size-4" />,
    },
    {
      id: '2',
      title: 'Deployment successful',
      description: 'Production v2.4.1 deployed.',
      time: '1 hour ago',
      category: 'updates',
      icon: <IconCheck class="size-4" />,
      read: true,
    },
    {
      id: '3',
      title: 'New team member',
      description: 'Bob joined the Engineering team.',
      time: '3 hours ago',
      category: 'updates',
      icon: <IconUser class="size-4" />,
    },
    {
      id: '4',
      title: 'Payment received',
      description: 'Invoice #1234 paid — $1,250.00',
      time: 'Yesterday',
      category: 'messages',
      icon: <IconCreditCard class="size-4" />,
      read: true,
    },
    {
      id: '5',
      title: 'System maintenance',
      description: 'Scheduled downtime on Feb 20, 2:00 AM UTC.',
      time: '2 days ago',
      category: 'updates',
      icon: <IconSettings class="size-4" />,
    },
  ])

  // -- FilterBuilder demo --
  const [filterRules, setFilterRules] = createSignal<FilterRule[]>([])

  return (
    <>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <div class="flex flex-1 items-center gap-2">
          <span class="text-muted-foreground text-sm">Press</span>
          <kbd class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded px-1.5 font-mono text-xs font-medium">
            <span class="text-xs">⌘</span>K
          </kbd>
          <span class="text-muted-foreground text-sm">to open command palette</span>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <NotificationCenter
            notifications={notifications()}
            categories={[
              { key: 'messages', label: 'Messages' },
              { key: 'updates', label: 'Updates' },
            ]}
            onRead={id =>
              setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
            }
            onReadAll={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          />
          <UserMenu
            name="John Doe"
            email="john@acme.com"
            groups={[
              {
                label: 'Account',
                items: [
                  {
                    label: 'Profile',
                    icon: <IconUser class="size-4" />,
                    onSelect: () => notify.info('Navigate to profile'),
                  },
                  {
                    label: 'Settings',
                    icon: <IconSettings class="size-4" />,
                    onSelect: () => notify.info('Navigate to settings'),
                  },
                ],
              },
            ]}
            onSignOut={() => notify('Signed out')}
          />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <PageHeader
          breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Dashboard' }]}
          title="Dashboard"
          description="Overview of your project metrics and recent activity."
          actions={<Button size="sm">Quick Create</Button>}
        />

        {/* Stats Cards (StatCard HOC) */}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value="$1,250.00"
            trend="up"
            trendText="+12.5% Trending up this month"
            icon={<TotalRevenueIcon />}
          />
          <StatCard
            label="New Customers"
            value="1,234"
            trend="down"
            trendText="-20% Down 20% this period"
            icon={<NewCustomersIcon />}
          />
          <StatCard
            label="Active Accounts"
            value="45,678"
            trend="up"
            trendText="+12.5% Strong user retention"
            icon={<ActiveAccountsIcon />}
          />
          <StatCard
            label="Growth Rate"
            value="4.5%"
            trend="up"
            trendText="+4.5% Steady performance increase"
            icon={<GrowthRateIcon />}
          />
        </div>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors for the last 6 months</CardTitle>
            <CardDescription>Total for the last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer<ChartDataPoint>
              config={chartConfig}
              type="xy"
              data={chartData}
              class="h-[300px] w-full"
            >
              <ChartCrosshair />
              <VisArea<ChartDataPoint>
                x={(d: ChartDataPoint, i: number) => i}
                y={(d: ChartDataPoint) => d.visitors}
                opacity={0.2}
              />
              <VisLine<ChartDataPoint>
                x={(d: ChartDataPoint, i: number) => i}
                y={(d: ChartDataPoint) => d.visitors}
              />
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  {selectedRows().size} of {tableData.length} row(s) selected.
                </CardDescription>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Customize Columns
                </Button>
                <Button variant="outline" size="sm">
                  Columns
                </Button>
                <Button variant="outline" size="sm">
                  Add Section
                </Button>
              </div>
            </div>
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
                // selectableRows: true,

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
                        {
                          label: '男',
                          value: 'male',
                        },
                        {
                          label: '女',
                          value: 'female',
                        },
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
                  {
                    id: 2,
                    name: 'Mary May',
                    progress: 1,
                    gender: 'female',
                    rating: 2,
                    col: 'blue',
                  },
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
            ></TabulatorTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[50px]">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300"
                      checked={selectedRows().size === tableData.length}
                      onChange={e => {
                        if (e.currentTarget.checked) {
                          setSelectedRows(new Set(tableData.map((_, i) => i)))
                        } else {
                          setSelectedRows(new Set<number>())
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Header</TableHead>
                  <TableHead>Section Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead class="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={tableData}>
                  {(row, index) => (
                    <TableRow data-state={selectedRows().has(index()) ? 'selected' : undefined}>
                      <TableCell>
                        <input
                          type="checkbox"
                          class="size-4 rounded border-gray-300"
                          checked={selectedRows().has(index())}
                          onChange={() => toggleRow(index())}
                        />
                      </TableCell>
                      <TableCell class="font-medium">{row.header}</TableCell>
                      <TableCell>{row.sectionType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status === 'Done'
                              ? 'default'
                              : row.status === 'In Process'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.target}</TableCell>
                      <TableCell>{row.limit}</TableCell>
                      <TableCell>
                        {row.reviewer === 'Reviewer' ? (
                          <Button variant="ghost" size="sm">
                            Assign reviewer
                          </Button>
                        ) : (
                          row.reviewer
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger as={Button} variant="ghost" size="icon-sm">
                            <MoreIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
            <div class="flex items-center justify-between border-t px-2 py-4">
              <div class="text-sm text-muted-foreground">Rows per page</div>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeftDoubleIcon />
                </Button>
                <span class="text-sm">Page 1 of 7</span>
                <Button variant="outline" size="sm">
                  <ChevronRightDoubleIcon />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TanStack Table Section — with DataTableToolbar + EmptyState HOCs */}
        <TanstackTableProvider table={tanstackTable}>
          <Card>
            <CardHeader>
              <CardTitle>TanStack Table</CardTitle>
              <CardDescription>
                Powered by @tanstack/solid-table — sorting, filtering, pagination, row selection.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <DataTableToolbar
                table={tanstackTable}
                searchColumn="name"
                locale={{ searchPlaceholder: '按名称筛选...' }}
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
                      title="未找到付款记录"
                      description="请尝试调整筛选条件"
                    />
                  }
                />
              </TanstackTable>
              <TanstackTablePagination pageSizeOptions={[5, 10, 20]} />
            </CardContent>
          </Card>
        </TanstackTableProvider>

        {/* HOC Demos Section */}
        <div class="grid gap-4 md:grid-cols-2">
          {/* useNotify Demo */}
          <Card>
            <CardHeader>
              <CardTitle>useNotify Hook</CardTitle>
              <CardDescription>Toast notifications with merged default options.</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => notify.success('File saved successfully')}>
                Success
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => notify.error('Something went wrong')}
              >
                Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => notify.warning('Disk space is running low')}
              >
                Warning
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => notify.info('New version available')}
              >
                Info
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  notify.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                    loading: 'Uploading...',
                    success: 'Upload complete!',
                    error: 'Upload failed',
                  })
                }}
              >
                Promise
              </Button>
            </CardContent>
          </Card>

          {/* confirm() Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Confirm Dialog</CardTitle>
              <CardDescription>
                Imperative confirmation dialogs via <code>confirm()</code>.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-3">
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'Save changes?',
                      description: 'Your unsaved changes will be committed.',
                    })
                    setConfirmResult(ok ? 'Confirmed' : 'Cancelled')
                  }}
                >
                  Default Confirm
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'Delete this item?',
                      description: 'This action cannot be undone.',
                      variant: 'destructive',
                      locale: { confirm: 'Delete', cancel: 'Keep' },
                    })
                    setConfirmResult(ok ? 'Deleted' : 'Kept')
                  }}
                >
                  Destructive Confirm
                </Button>
              </div>
              {confirmResult() && (
                <p class="text-muted-foreground text-sm">
                  Result: <span class="text-foreground font-medium">{confirmResult()}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* FormField Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Form Field</CardTitle>
              <CardDescription>
                Unified label + input + error + description wrapper.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <FormField
                label="Username"
                required
                description="This will be your public display name."
              >
                <TextField>
                  <TextFieldInput placeholder="Enter username" />
                </TextField>
              </FormField>
              <FormField label="Email" required error="Please enter a valid email address.">
                <TextField validationState="invalid">
                  <TextFieldInput type="email" placeholder="you@example.com" />
                </TextField>
              </FormField>
              <FormField label="Bio" description="Tell us about yourself.">
                <TextField>
                  <TextFieldInput placeholder="Optional bio" />
                </TextField>
              </FormField>
            </CardContent>
          </Card>

          {/* EmptyState Standalone Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
              <CardDescription>
                Placeholder for empty data, search results, or permission walls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<IconMail class="size-12" />}
                title="No messages"
                description="You haven't received any messages yet. Start a conversation to get going."
                action={
                  <Button size="sm" onClick={() => notify.info('Compose clicked')}>
                    Compose
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        <Separator class="my-4" />
        <h2 class="text-xl font-bold tracking-tight">New HOC Components</h2>

        {/* DataTable HOC Demo */}
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>DataTable HOC</CardTitle>
                <CardDescription>
                  Full-featured table with toolbar, pagination, loading skeleton & empty state — all
                  in one component.
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

        {/* Stepper Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Stepper</CardTitle>
            <CardDescription>
              Multi-step wizard with per-step validation and navigation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stepper
              activeStep={stepperActiveStep()}
              onActiveStepChange={setStepperActiveStep}
              steps={[
                {
                  label: 'Account',
                  description: 'Create your account',
                  content: (
                    <div class="flex flex-col gap-4 py-4">
                      <FormField label="Email" required>
                        <TextField>
                          <TextFieldInput type="email" placeholder="you@example.com" />
                        </TextField>
                      </FormField>
                      <FormField label="Password" required>
                        <TextField>
                          <TextFieldInput type="password" placeholder="Create a password" />
                        </TextField>
                      </FormField>
                    </div>
                  ),
                },
                {
                  label: 'Profile',
                  description: 'Set up your profile',
                  content: (
                    <div class="flex flex-col gap-4 py-4">
                      <FormField label="Display Name" required>
                        <TextField>
                          <TextFieldInput placeholder="John Doe" />
                        </TextField>
                      </FormField>
                      <FormField label="Bio" description="Tell us about yourself.">
                        <TextField>
                          <TextFieldInput placeholder="Software engineer..." />
                        </TextField>
                      </FormField>
                    </div>
                  ),
                },
                {
                  label: 'Review',
                  description: 'Confirm details',
                  content: (
                    <div class="py-4">
                      <p class="text-muted-foreground text-sm">
                        Review your information and click "Finish" to complete the setup.
                      </p>
                    </div>
                  ),
                },
              ]}
              onComplete={() => {
                notify.success('Setup complete!')
                setStepperActiveStep(0)
              }}
            />
          </CardContent>
        </Card>

        {/* DescriptionList + Timeline side by side */}
        <div class="grid gap-4 md:grid-cols-2">
          {/* DescriptionList Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Description List</CardTitle>
              <CardDescription>Structured key-value display for detail pages.</CardDescription>
            </CardHeader>
            <CardContent>
              <DescriptionList
                columns={2}
                bordered
                items={[
                  { label: 'Full Name', value: 'John Doe' },
                  { label: 'Email', value: 'john@example.com', copyable: true },
                  { label: 'Role', value: <Badge>Admin</Badge> },
                  { label: 'Status', value: <Badge variant="secondary">Active</Badge> },
                  {
                    label: 'Bio',
                    value:
                      'Full-stack engineer with 10+ years of experience in building web applications.',
                    span: 2,
                  },
                  { label: 'Joined', value: 'January 15, 2024' },
                  { label: 'Last Login', value: '5 minutes ago' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Timeline Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Activity feeds, changelogs, and order tracking.</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    title: 'Order placed',
                    time: 'Jan 15, 2024',
                    description: 'Your order #1234 has been received and is being processed.',
                    icon: <IconCreditCard class="size-4" />,
                  },
                  {
                    title: 'Payment confirmed',
                    time: 'Jan 15, 2024',
                    description: 'Payment of $1,250.00 was successfully processed.',
                    icon: <IconCheck class="size-4" />,
                  },
                  {
                    title: 'Processing',
                    time: 'Jan 16, 2024',
                    description: 'Your order is being prepared for shipment.',
                    icon: <IconLoader class="size-4" />,
                  },
                  {
                    title: 'Shipped',
                    time: 'Jan 17, 2024',
                    description: 'Package has been handed to the carrier.',
                  },
                  {
                    title: 'Delivered',
                    time: 'Jan 19, 2024',
                    description: 'Package was delivered to the front door.',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* FileUploadZone Demo */}
        <Card>
          <CardHeader>
            <CardTitle>File Upload Zone</CardTitle>
            <CardDescription>
              Drag-and-drop file upload with validation, preview and progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              accept="image/*,.pdf"
              maxSize={5 * 1024 * 1024}
              maxFiles={3}
              value={uploadedFiles()}
              onFilesAdd={files => {
                const newFiles: UploadFile[] = files.map(f => ({
                  file: f,
                  id: `${Date.now()}-${f.name}`,
                  status: 'done' as const,
                  preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
                }))
                setUploadedFiles(prev => [...prev, ...newFiles])
              }}
              onRemove={file => {
                setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
              }}
            />
          </CardContent>
        </Card>

        {/* TagInput + FilterBuilder side by side */}
        <div class="grid gap-4 md:grid-cols-2">
          {/* TagInput Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Input</CardTitle>
              <CardDescription>Multi-tag input with autocomplete suggestions.</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-3">
              <TagInput
                value={tags()}
                onChange={setTags}
                suggestions={[
                  'SolidJS',
                  'TypeScript',
                  'React',
                  'Vue',
                  'Svelte',
                  'Angular',
                  'Tailwind',
                  'Vite',
                ]}
                max={6}
                placeholder="Add a framework..."
              />
              <p class="text-muted-foreground text-sm">
                Current tags: {tags().join(', ') || 'none'}
              </p>
            </CardContent>
          </Card>

          {/* FilterBuilder Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Builder</CardTitle>
              <CardDescription>Composable filter rules: field + operator + value.</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-3">
              <FilterBuilder
                fields={[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'amount', label: 'Amount', type: 'number' },
                  {
                    key: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Processing', value: 'processing' },
                      { label: 'Success', value: 'success' },
                      { label: 'Failed', value: 'failed' },
                    ],
                  },
                  { key: 'date', label: 'Date', type: 'date' },
                ]}
                value={filterRules()}
                onChange={setFilterRules}
                maxRules={5}
              />
              <p class="text-muted-foreground text-sm">Active rules: {filterRules().length}</p>
            </CardContent>
          </Card>
        </div>

        {/* TransferList Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer List</CardTitle>
            <CardDescription>
              Dual-panel list for moving items between "available" and "selected".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransferList
              source={transferSource}
              target={transferTarget()}
              onChange={setTransferTarget}
              titles={['Available Roles', 'Assigned Roles']}
            />
          </CardContent>
        </Card>

        {/* LoginForm Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Login Form</CardTitle>
            <CardDescription>
              Pre-built authentication form with social providers and mode switching.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-center py-6">
            <LoginForm
              mode={loginMode()}
              providers={[
                {
                  name: 'Google',
                  icon: <IconBrandGoogle class="size-4" />,
                  onSelect: () => notify.info('Google sign-in'),
                },
                {
                  name: 'GitHub',
                  icon: <IconBrandGithub class="size-4" />,
                  onSelect: () => notify.info('GitHub sign-in'),
                },
              ]}
              forgotPasswordHref="#"
              onSubmit={data => {
                notify.success(
                  `${loginMode() === 'login' ? 'Signed in' : 'Registered'} as ${data.email}`,
                )
              }}
              onModeSwitch={() => setLoginMode(m => (m === 'login' ? 'register' : 'login'))}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
