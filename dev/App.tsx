import type { Component } from 'solid-js'
import { For, createSignal } from 'solid-js'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Separator } from '@/components/separator'
import { ChartContainer, ChartTooltipContent, ChartCrosshair } from '@/components/chart'
import { VisLine, VisArea } from '@unovis/solid'
import { ModeToggleDropdown } from '@/hoc/mode-toggle-dropdown'

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

type ChartDataPoint = typeof chartData[0]

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

const App: Component = () => {
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set())

  const toggleRow = (index: number) => {
    setSelectedRows((prev) => {
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
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-2 py-1.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-semibold">Acme Inc.</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Lifecycle</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M15.5 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15.5 2z" />
                      <polyline points="15 2 15 8 21 8" />
                    </svg>
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    <span>Data Library</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Word Assistant</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                    <span>More</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                </svg>
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>Get Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
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
              <ChartContainer<ChartDataPoint> config={chartConfig} type="xy" data={chartData} class="h-[300px] w-full">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[50px]">
                      <input
                        type="checkbox"
                        class="size-4 rounded border-gray-300"
                        checked={selectedRows().size === tableData.length}
                        onChange={(e) => {
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
                      <TableRow
                        data-state={selectedRows().has(index()) ? 'selected' : undefined}
                      >
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
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
                <div class="text-sm text-muted-foreground">
                  Rows per page
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="11 17 6 12 11 7" />
                      <polyline points="18 17 13 12 18 7" />
                    </svg>
                  </Button>
                  <span class="text-sm">Page 1 of 7</span>
                  <Button variant="outline" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="13 17 18 12 13 7" />
                      <polyline points="6 17 11 12 6 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
