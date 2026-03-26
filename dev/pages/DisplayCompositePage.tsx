import { type Component, createSignal } from 'solid-js'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { IconCheck, IconCreditCard, IconLoader, IconSettings, IconUser } from '@/components/icons'
import { TextField, TextFieldInput } from '@/components/text-field'
import { DescriptionList } from '@/hoc/description-list'
import { FormField } from '@/hoc/form-field'
import { PageHeader } from '@/hoc/page-header'
import { StatCard } from '@/hoc/stat-card'
import { Stepper } from '@/hoc/stepper'
import { Timeline } from '@/hoc/timeline'
import { type TransferItem, TransferList } from '@/hoc/transfer-list'
import { useNotify } from '@/hoc/use-notify'
import { UserMenu } from '@/hoc/user-menu'
import {
  ActiveAccountsIcon,
  GrowthRateIcon,
  NewCustomersIcon,
  TotalRevenueIcon,
} from '../components/icons'
import { PageLayout } from '../components/PageLayout'

const transferSource: TransferItem[] = [
  { key: 'admin', label: 'Admin', description: 'Full access to all resources' },
  { key: 'editor', label: 'Editor', description: 'Can edit content' },
  { key: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { key: 'moderator', label: 'Moderator', description: 'Can moderate content' },
  { key: 'contributor', label: 'Contributor', description: 'Can submit content' },
  { key: 'analyst', label: 'Analyst', description: 'Can view analytics' },
]

const DisplayCompositePage: Component = () => {
  const notify = useNotify({ position: 'bottom-right' })
  const [stepperActiveStep, setStepperActiveStep] = createSignal(0)
  const [transferTarget, setTransferTarget] = createSignal<string[]>(['admin'])

  return (
    <PageLayout
      title="Display Composites"
      description="Display HOCs: StatCard, DescriptionList, Timeline, Stepper, TransferList, PageHeader, UserMenu."
    >
      {/* StatCard */}
      <Card>
        <CardHeader>
          <CardTitle>Stat Card</CardTitle>
          <CardDescription>Statistics cards with trend indicators.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value="$1,250.00"
              trend="up"
              trendText="+12.5% this month"
              icon={<TotalRevenueIcon />}
            />
            <StatCard
              label="New Customers"
              value="1,234"
              trend="down"
              trendText="-20% this period"
              icon={<NewCustomersIcon />}
            />
            <StatCard
              label="Active Accounts"
              value="45,678"
              trend="up"
              trendText="+12.5% retention"
              icon={<ActiveAccountsIcon />}
            />
            <StatCard
              label="Growth Rate"
              value="4.5%"
              trend="up"
              trendText="+4.5% increase"
              icon={<GrowthRateIcon />}
            />
          </div>
        </CardContent>
      </Card>

      {/* PageHeader + UserMenu */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header & User Menu</CardTitle>
          <CardDescription>Page header with breadcrumbs and user menu dropdown.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <PageHeader
            breadcrumbs={[
              { label: 'Home', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Profile' },
            ]}
            title="Profile Settings"
            description="Manage your account settings and preferences."
            actions={
              <div class="flex gap-2">
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
                          onSelect: () => notify.info('Profile'),
                        },
                        {
                          label: 'Settings',
                          icon: <IconSettings class="size-4" />,
                          onSelect: () => notify.info('Settings'),
                        },
                      ],
                    },
                  ]}
                  onSignOut={() => notify('Signed out')}
                />
                <Button size="sm">Save</Button>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* DescriptionList + Timeline */}
      <div class="grid gap-4 md:grid-cols-2">
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
                  value: 'Full-stack engineer with 10+ years of experience.',
                  span: 2,
                },
                { label: 'Joined', value: 'January 15, 2024' },
                { label: 'Last Login', value: '5 minutes ago' },
              ]}
            />
          </CardContent>
        </Card>

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
                  description: 'Order #1234 received.',
                  icon: <IconCreditCard class="size-4" />,
                },
                {
                  title: 'Payment confirmed',
                  time: 'Jan 15, 2024',
                  description: '$1,250.00 processed.',
                  icon: <IconCheck class="size-4" />,
                },
                {
                  title: 'Processing',
                  time: 'Jan 16, 2024',
                  description: 'Preparing for shipment.',
                  icon: <IconLoader class="size-4" />,
                },
                {
                  title: 'Shipped',
                  time: 'Jan 17, 2024',
                  description: 'Package handed to carrier.',
                },
                {
                  title: 'Delivered',
                  time: 'Jan 19, 2024',
                  description: 'Delivered to front door.',
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Stepper */}
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

      {/* TransferList */}
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
    </PageLayout>
  )
}

export default DisplayCompositePage
