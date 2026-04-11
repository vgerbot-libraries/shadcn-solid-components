import type { Component } from 'solid-js'
import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  IconCalendar,
  IconMail,
  IconUser,
} from 'shadcn-solid-components/components/icons'
import { TextField, TextFieldInput, TextFieldLabel } from 'shadcn-solid-components/components/text-field'
import { Separator } from 'shadcn-solid-components/components/separator'
import { ProfileHeader, type ProfileStat, type ProfileTab } from 'shadcn-solid-components/hoc/profile-header'
import { PageLayout } from '../components/PageLayout'

const stats: ProfileStat[] = [
  { label: 'Followers', value: '1.2k' },
  { label: 'Following', value: 384 },
  { label: 'Projects', value: 42 },
  { label: 'Posts', value: 156 },
]

const profileTabs: ProfileTab[] = [
  {
    id: 'personal',
    label: 'Personal',
    body: (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile information.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <TextField>
                <TextFieldLabel>First Name</TextFieldLabel>
                <TextFieldInput id="firstName" value="John" />
              </TextField>
            </div>
            <div class="space-y-2">
              <TextField>
                <TextFieldLabel>Last Name</TextFieldLabel>
                <TextFieldInput id="lastName" value="Doe" />
              </TextField>
            </div>
            <div class="space-y-2">
              <TextField>
                <TextFieldLabel>Email</TextFieldLabel>
                <TextFieldInput id="email" type="email" value="john.doe@example.com" />
              </TextField>
            </div>
            <div class="space-y-2">
              <TextField>
                <TextFieldLabel>Phone</TextFieldLabel>
                <TextFieldInput id="phone" type="tel" value="+1 (555) 123-4567" />
              </TextField>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'account',
    label: 'Account',
    body: (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and subscription.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-base">Account Status</div>
              <p class="text-muted-foreground text-sm">Your account is currently active</p>
            </div>
            <Badge variant="outline" class="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
              Active
            </Badge>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-base">Subscription Plan</div>
              <p class="text-muted-foreground text-sm">Pro Plan - $29/month</p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    body: (
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and authentication.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-base">Password</div>
              <p class="text-muted-foreground text-sm">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-base">Two-Factor Authentication</div>
              <p class="text-muted-foreground text-sm">Add an extra layer of security</p>
            </div>
            <Badge variant="outline" class="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    ),
  },
]

const ProfilePage: Component = () => {
  return (
    <PageLayout
      title="Profile Header"
      description="User profile header with avatar, cover image, stats, and tabbed content."
    >
      {/* Basic */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Profile</CardTitle>
          <CardDescription>
            Avatar, name, subtitle, info items, and an action button.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileHeader
            avatar="https://bundui-images.netlify.app/avatars/08.png"
            name="John Doe"
            subtitle="Senior Product Designer"
            badge={<Badge variant="secondary">Pro Member</Badge>}
            actions={<Button>Edit Profile</Button>}
            infoItems={
              <>
                <span class="flex items-center gap-1">
                  <IconMail class="size-4" />
                  john.doe@example.com
                </span>
                <span class="flex items-center gap-1">
                  <IconCalendar class="size-4" />
                  Joined March 2023
                </span>
              </>
            }
          />
        </CardContent>
      </Card>

      {/* With cover image & stats */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image & Stats</CardTitle>
          <CardDescription>
            Profile with a banner cover image and a stats row.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileHeader
            coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop"
            avatar="https://images.unsplash.com/photo-1651601787600-40ad979813ac?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            name="John Doe"
            subtitle="Senior Product Designer"
            bio="Passionate product designer with 8+ years of experience creating user-centered digital experiences."
            badge={<Badge variant="destructive">Pro</Badge>}
            stats={stats}
            actions={
              <>
                <Button variant="outline">Message</Button>
                <Button>Follow</Button>
              </>
            }
          />
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Initials fallback */}
        <Card>
          <CardHeader>
            <CardTitle>Initials Fallback</CardTitle>
            <CardDescription>When no avatar image is provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileHeader
              initials="JD"
              name="Jane Doe"
              subtitle="Engineering Manager"
              stats={[
                { label: 'Reports', value: 12 },
                { label: 'Teams', value: 3 },
              ]}
              actions={<Button variant="outline">View Team</Button>}
            />
          </CardContent>
        </Card>

        {/* Minimal */}
        <Card>
          <CardHeader>
            <CardTitle>Minimal</CardTitle>
            <CardDescription>Name and subtitle only.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileHeader
              name="Alex Smith"
              subtitle="Guest User"
            />
          </CardContent>
        </Card>
      </div>

      {/* Full profile with tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Full Profile with Tabs</CardTitle>
          <CardDescription>
            Complete profile page with header, stats, and tabbed content panels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileHeader
            coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop"
            avatar="https://plus.unsplash.com/premium_vector-1724790120830-587ead1ffa26?q=80&w=882&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            name="John Doe"
            subtitle="Senior Product Designer"
            bio="Passionate product designer with 8+ years of experience creating user-centered digital experiences. I love solving complex problems and turning ideas into beautiful, functional products."
            badge={<Badge variant="secondary">Pro Member</Badge>}
            stats={stats}
            actions={<Button>Edit Profile</Button>}
            infoItems={
              <>
                <span class="flex items-center gap-1">
                  <IconMail class="size-4" />
                  john.doe@example.com
                </span>
                <span class="flex items-center gap-1">
                  <IconUser class="size-4" />
                  San Francisco, CA
                </span>
                <span class="flex items-center gap-1">
                  <IconCalendar class="size-4" />
                  Joined March 2023
                </span>
              </>
            }
            tabs={profileTabs}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default ProfilePage
