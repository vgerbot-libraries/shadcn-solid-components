import { createEffect, type Component } from 'solid-js'
import { For, createSignal } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { TabulatorTable } from '@/components/tabulator-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Separator } from '@/components/separator'
import { SidebarTrigger } from '@/components/sidebar'
import { ChartContainer, ChartCrosshair } from '@/components/chart'
import { VisLine, VisArea } from '@unovis/solid'
import { ModeToggleDropdown } from '@/hoc/mode-toggle-dropdown'
import {
  TotalRevenueIcon,
  NewCustomersIcon,
  ActiveAccountsIcon,
  GrowthRateIcon,
  MoreIcon,
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
} from './icons'
import { type Tabulator } from 'tabulator-tables'

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

export const Main: Component = () => {
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set())

  const [tabulator, setTabulator] = createSignal<Tabulator | undefined>()

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

  return (
    <>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <div class="flex flex-1 items-center gap-2">
          <h1 class="text-lg font-semibold">Documents</h1>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <ModeToggleDropdown
            trigger={{
              size: 'icon',
              variant: 'ghost',
            }}
          />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Quick Create Section */}
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold tracking-tight">Quick Create</h2>
        </div>

        {/* Stats Cards */}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
              <TotalRevenueIcon />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">$1,250.00</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <span class="text-green-600">+12.5%</span>
                <span>Trending up this month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">New Customers</CardTitle>
              <NewCustomersIcon />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">1,234</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <span class="text-red-600">-20%</span>
                <span>Down 20% this period</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Active Accounts</CardTitle>
              <ActiveAccountsIcon />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">45,678</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <span class="text-green-600">+12.5%</span>
                <span>Strong user retention</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Growth Rate</CardTitle>
              <GrowthRateIcon />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">4.5%</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <span class="text-green-600">+4.5%</span>
                <span>Steady performance increase</span>
              </p>
            </CardContent>
          </Card>
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
      </div>
    </>
  )
}
