import { createSignal, type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { IconInbox, IconMail, IconUser, IconSettings, IconCreditCard, IconCheck } from '@/components/icons'
import { useNotify } from '@/hoc/use-notify'
import { confirm } from '@/hoc/confirm-dialog'
import { NotificationCenter, type NotificationItem } from '@/hoc/notification-center'
import { EmptyState } from '@/hoc/empty-state'
import { ModeToggleDropdown } from '@/hoc/mode-toggle-dropdown'
import { PageLayout } from '../components/PageLayout'

const FeedbackPage: Component = () => {
  const notify = useNotify({ position: 'bottom-right' })
  const [confirmResult, setConfirmResult] = createSignal('')

  const [notifications, setNotifications] = createSignal<NotificationItem[]>([
    { id: '1', title: 'New comment on your post', description: 'Alice replied to your discussion.', time: '5 min ago', category: 'messages', icon: <IconMail class="size-4" /> },
    { id: '2', title: 'Deployment successful', description: 'Production v2.4.1 deployed.', time: '1 hour ago', category: 'updates', icon: <IconCheck class="size-4" />, read: true },
    { id: '3', title: 'New team member', description: 'Bob joined Engineering.', time: '3 hours ago', category: 'updates', icon: <IconUser class="size-4" /> },
    { id: '4', title: 'Payment received', description: 'Invoice #1234 paid — $1,250.00', time: 'Yesterday', category: 'messages', icon: <IconCreditCard class="size-4" />, read: true },
    { id: '5', title: 'System maintenance', description: 'Scheduled downtime on Feb 20.', time: '2 days ago', category: 'updates', icon: <IconSettings class="size-4" /> },
  ])

  return (
    <PageLayout title="Feedback" description="Feedback components: useNotify, ConfirmDialog, NotificationCenter, EmptyState, ModeToggle.">
      <div class="grid gap-4 md:grid-cols-2">
        {/* useNotify */}
        <Card>
          <CardHeader>
            <CardTitle>useNotify Hook</CardTitle>
            <CardDescription>Toast notifications with merged default options.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => notify.success('File saved successfully')}>Success</Button>
            <Button size="sm" variant="destructive" onClick={() => notify.error('Something went wrong')}>Error</Button>
            <Button size="sm" variant="outline" onClick={() => notify.warning('Disk space is running low')}>Warning</Button>
            <Button size="sm" variant="secondary" onClick={() => notify.info('New version available')}>Info</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                notify.promise(
                  new Promise(resolve => setTimeout(resolve, 2000)),
                  { loading: 'Uploading...', success: 'Upload complete!', error: 'Upload failed' },
                )
              }}
            >
              Promise
            </Button>
          </CardContent>
        </Card>

        {/* confirm() */}
        <Card>
          <CardHeader>
            <CardTitle>Confirm Dialog</CardTitle>
            <CardDescription>Imperative confirmation dialogs via <code>confirm()</code>.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div class="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const ok = await confirm({ title: 'Save changes?', description: 'Your unsaved changes will be committed.' })
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
      </div>

      {/* NotificationCenter */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>Notification bell with categorized notification list.</CardDescription>
        </CardHeader>
        <CardContent class="flex items-center gap-4">
          <NotificationCenter
            notifications={notifications()}
            categories={[
              { key: 'messages', label: 'Messages' },
              { key: 'updates', label: 'Updates' },
            ]}
            onRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
            onReadAll={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          />
          <span class="text-muted-foreground text-sm">
            {notifications().filter(n => !n.read).length} unread notifications
          </span>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* EmptyState */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
            <CardDescription>Placeholder for empty data.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<IconMail class="size-12" />}
              title="No messages"
              description="You haven't received any messages yet. Start a conversation to get going."
              action={<Button size="sm" onClick={() => notify.info('Compose clicked')}>Compose</Button>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empty State (Minimal)</CardTitle>
            <CardDescription>Simple icon + text empty state.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<IconInbox class="size-10" />}
              title="No results found"
              description="Try adjusting your search or filters."
            />
          </CardContent>
        </Card>
      </div>

      {/* ModeToggle */}
      <Card>
        <CardHeader>
          <CardTitle>Mode Toggle</CardTitle>
          <CardDescription>Theme mode switcher (light / dark / system).</CardDescription>
        </CardHeader>
        <CardContent class="flex items-center gap-4">
          <ModeToggleDropdown />
          <span class="text-muted-foreground text-sm">Click to switch theme mode</span>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default FeedbackPage
