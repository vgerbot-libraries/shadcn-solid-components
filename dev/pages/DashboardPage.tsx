import { VisArea, VisLine } from '@unovis/solid'
import { type Component, createSignal, For } from 'solid-js'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { ChartContainer, ChartCrosshair } from '@/components/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { IconCheck, IconCreditCard, IconMail, IconSettings, IconUser } from '@/components/icons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { NotificationCenter, type NotificationItem } from '@/hoc/notification-center'
import { PageHeader } from '@/hoc/page-header'
import { StatCard } from '@/hoc/stat-card'
import { useNotify } from '@/hoc/use-notify'
import { UserMenu } from '@/hoc/user-menu'
import {
  ActiveAccountsIcon,
  GrowthRateIcon,
  MoreIcon,
  NewCustomersIcon,
  TotalRevenueIcon,
} from '../components/icons'
import { PageLayout } from '../components/PageLayout'

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
  visitors: { label: 'Visitors', color: 'hsl(var(--chart-1))' },
  month: { label: 'Month' },
}

type ChartDataPoint = (typeof chartData)[0]

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
]

const DashboardPage: Component = () => {
  const notify = useNotify({ position: 'bottom-right' })
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set())

  const [notifications, setNotifications] = createSignal<NotificationItem[]>([
    {
      id: '1',
      title: 'New comment on your post',
      description: 'Alice replied to your discussion.',
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
      description: 'Scheduled downtime on Feb 20.',
      time: '2 days ago',
      category: 'updates',
      icon: <IconSettings class="size-4" />,
    },
  ])

  const toggleRow = (index: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your project metrics and recent activity."
      actions={
        <>
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
        </>
      }
    >
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Dashboard' }]}
        title="Dashboard"
        description="Overview of your project metrics and recent activity."
        actions={<Button size="sm">Quick Create</Button>}
      />

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

      <Card>
        <CardHeader>
          <CardTitle>Visitors for the last 12 months</CardTitle>
          <CardDescription>Monthly visitor trends</CardDescription>
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
              x={(_d: ChartDataPoint, i: number) => i}
              y={(d: ChartDataPoint) => d.visitors}
              opacity={0.2}
            />
            <VisLine<ChartDataPoint>
              x={(_d: ChartDataPoint, i: number) => i}
              y={(d: ChartDataPoint) => d.visitors}
            />
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {selectedRows().size} of {tableData.length} row(s) selected.
              </CardDescription>
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
                    onChange={e => {
                      if (e.currentTarget.checked)
                        setSelectedRows(new Set(tableData.map((_, i) => i)))
                      else setSelectedRows(new Set<number>())
                    }}
                  />
                </TableHead>
                <TableHead>Header</TableHead>
                <TableHead>Section Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead class="w-[50px]" />
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
                    <TableCell>{row.reviewer}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger as={Button} variant="ghost" size="icon-sm">
                          <MoreIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default DashboardPage
