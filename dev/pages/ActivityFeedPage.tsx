import { type Component, createSignal } from 'solid-js'
import { Badge } from 'shadcn-solid-components/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  IconCheck,
  IconCreditCard,
  IconMail,
  IconMessages,
  IconRocket,
  IconSettings,
  IconStar,
  IconUser,
} from 'shadcn-solid-components/components/icons'
import { ActivityFeed, type ActivityItem } from 'shadcn-solid-components/hoc/activity-feed'
import { PageLayout } from '../components/PageLayout'

const baseItems: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Alice Green', initials: 'AG' },
    action: 'commented on',
    target: 'Pull Request #123',
    timestamp: '06:20 PM',
    group: 'Today',
    meta: (
      <div class="bg-muted rounded-md p-3 text-sm">
        Looks great! Just one small nit on the error handling path.
      </div>
    ),
  },
  {
    id: '2',
    user: { name: 'Bob Smith', initials: 'BS' },
    action: 'merged',
    target: 'feat/dashboard-charts',
    timestamp: '04:15 PM',
    group: 'Today',
  },
  {
    id: '3',
    user: { name: 'Carol Wu', initials: 'CW' },
    action: 'deployed to',
    target: 'Production v2.4.1',
    timestamp: '02:30 PM',
    group: 'Today',
    meta: (
      <div class="flex gap-2">
        <Badge variant="secondary">v2.4.1</Badge>
        <Badge variant="outline">production</Badge>
      </div>
    ),
  },
  {
    id: '4',
    user: { name: 'David Lee', initials: 'DL' },
    action: 'assigned',
    target: 'Issue #456',
    timestamp: '11:45 AM',
    group: 'Yesterday',
  },
  {
    id: '5',
    user: { name: 'Eva Chen', initials: 'EC' },
    action: 'created',
    target: 'Design System RFC',
    timestamp: '09:00 AM',
    group: 'Yesterday',
    meta: (
      <div class="bg-muted rounded-md p-3 text-sm">
        Proposing a unified token system for colors, spacing, and typography across all products.
      </div>
    ),
  },
  {
    id: '6',
    user: { name: 'Frank Zhang', initials: 'FZ' },
    action: 'closed',
    target: 'Bug #789',
    timestamp: '03:20 PM',
    group: 'March 5, 2026',
  },
]

const iconItems: ActivityItem[] = [
  {
    id: 'i1',
    user: { name: 'System' },
    action: 'New release published',
    target: 'v3.0.0',
    timestamp: '10:00 AM',
    icon: <IconRocket class="size-4" />,
  },
  {
    id: 'i2',
    user: { name: 'System' },
    action: 'Payment received',
    target: 'Invoice #1234',
    timestamp: '09:30 AM',
    icon: <IconCreditCard class="size-4" />,
  },
  {
    id: 'i3',
    user: { name: 'System' },
    action: 'New user registered',
    target: 'john@example.com',
    timestamp: '08:15 AM',
    icon: <IconUser class="size-4" />,
  },
  {
    id: 'i4',
    user: { name: 'System' },
    action: 'Security scan completed',
    timestamp: '07:00 AM',
    icon: <IconCheck class="size-4" />,
  },
  {
    id: 'i5',
    user: { name: 'System' },
    action: 'Settings updated by',
    target: 'Admin',
    timestamp: '06:45 AM',
    icon: <IconSettings class="size-4" />,
  },
]

const ActivityFeedPage: Component = () => {
  const [loadingMore, setLoadingMore] = createSignal(false)

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => setLoadingMore(false), 1500)
  }

  return (
    <PageLayout
      title="Activity Feed"
      description="Activity timeline with date grouping, avatars, icons, and metadata."
    >
      {/* Grouped by date */}
      <Card>
        <CardHeader>
          <CardTitle>Grouped by Date</CardTitle>
          <CardDescription>
            Activity items grouped by date with avatar initials, targets, and meta content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            items={baseItems}
            groupBy="date"
            onLoadMore={handleLoadMore}
            loadingMore={loadingMore()}
          />
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Custom icons */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Icons</CardTitle>
            <CardDescription>
              System notifications with custom icons instead of avatars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={iconItems} />
          </CardContent>
        </Card>

        {/* Flat list (no grouping) */}
        <Card>
          <CardHeader>
            <CardTitle>Flat List</CardTitle>
            <CardDescription>Activity items without date grouping.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={baseItems.slice(0, 4)} groupBy="none" />
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Empty state */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
            <CardDescription>When there are no activity items.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={[]} />
          </CardContent>
        </Card>

        {/* Loading state */}
        <Card>
          <CardHeader>
            <CardTitle>Loading State</CardTitle>
            <CardDescription>Feed in loading state.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={[]} loading />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default ActivityFeedPage
