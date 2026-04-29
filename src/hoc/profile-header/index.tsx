import { Card, CardContent } from 'shadcn-solid-components/components/card'
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from 'shadcn-solid-components/components/tabs'
import { cx } from 'shadcn-solid-components/lib/cva'
import { type ComponentProps, For, type JSX, Show, splitProps } from 'solid-js'

// ============================================================================
// Types
// ============================================================================

/** A single stat displayed in the profile stats row. */
export interface ProfileStat {
  /** Stat label (e.g. "Followers"). */
  label: string
  /** Stat value (e.g. 1280 or "1.2k"). */
  value: string | number
}

/** A tab displayed below the profile header. */
export interface ProfileTab {
  /** Unique tab identifier. */
  id: string
  /** Tab trigger label. */
  label: JSX.Element
  /** Tab panel body content. */
  body: JSX.Element
}

export interface ProfileHeaderProps extends ComponentProps<'div'> {
  /** Avatar image URL. */
  avatar?: string
  /** Fallback initials when avatar is not available (e.g. "JD"). */
  initials?: string
  /** User display name. */
  name: string
  /** Secondary text below the name (e.g. job title). */
  subtitle?: string
  /** Short bio / description text. */
  bio?: string
  /** Optional badge element rendered next to the name (e.g. "Pro Member"). */
  badge?: JSX.Element
  /** Cover / banner image URL. When provided a banner section is rendered above the avatar. */
  coverImage?: string
  /** Stat items displayed in a horizontal row (e.g. followers, projects). */
  stats?: ProfileStat[]
  /** Action buttons rendered on the right side of the header. */
  actions?: JSX.Element
  /** Additional info items below the subtitle (e.g. email, location, joined date). */
  infoItems?: JSX.Element
  /** Tab panels rendered below the header card. */
  tabs?: ProfileTab[]
  /** Controlled active tab id. */
  activeTab?: string
  /** Callback when the active tab changes. */
  onTabChange?: (id: string) => void
}

// ============================================================================
// Component
// ============================================================================

/**
 * A user profile header with optional cover image, avatar, stats row,
 * action buttons, and tabbed content panels.
 *
 * @example
 * ```tsx
 * <ProfileHeader
 *   avatar="https://example.com/avatar.png"
 *   initials="JD"
 *   name="John Doe"
 *   subtitle="Senior Product Designer"
 *   bio="Passionate designer with 8+ years of experience."
 *   badge={<Badge variant="secondary">Pro</Badge>}
 *   stats={[
 *     { label: 'Followers', value: '1.2k' },
 *     { label: 'Projects', value: 42 },
 *   ]}
 *   actions={<Button>Edit Profile</Button>}
 *   infoItems={
 *     <>
 *       <span class="flex items-center gap-1"><IconMail class="size-4" /> john@example.com</span>
 *       <span class="flex items-center gap-1"><IconCalendar class="size-4" /> Joined March 2023</span>
 *     </>
 *   }
 *   tabs={[
 *     { id: 'posts', label: 'Posts', body: <div>Posts content</div> },
 *     { id: 'about', label: 'About', body: <div>About content</div> },
 *   ]}
 * />
 * ```
 */
export function ProfileHeader(props: ProfileHeaderProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'avatar',
    'initials',
    'name',
    'subtitle',
    'bio',
    'badge',
    'coverImage',
    'stats',
    'actions',
    'infoItems',
    'tabs',
    'activeTab',
    'onTabChange',
  ])

  const avatarNode = () => (
    <div data-slot="profile-avatar" class="relative">
      <Show
        when={local.avatar}
        fallback={
          <span class="bg-primary text-primary-foreground flex size-20 items-center justify-center rounded-full text-2xl font-semibold md:size-24">
            {local.initials || local.name.substring(0, 2).toUpperCase()}
          </span>
        }
      >
        <img
          src={local.avatar}
          alt={local.name}
          class="size-20 rounded-full border-4 border-white object-cover dark:border-gray-900 md:size-24"
        />
      </Show>
    </div>
  )

  return (
    <div data-slot="profile-header" class={cx('space-y-6', local.class)} {...rest}>
      <Card class="overflow-hidden">
        {/* Cover image */}
        <Show when={local.coverImage}>
          <div data-slot="profile-cover" class="relative h-32 md:h-48">
            <img src={local.coverImage} alt="" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Show>

        <CardContent
          class={cx('flex flex-col gap-4 md:gap-6', local.coverImage && '-mt-10 md:-mt-12 z-1')}
        >
          <div class="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            {/* Avatar */}
            {avatarNode()}

            {/* Name, subtitle, bio, info */}
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-2">
                <h2 class="text-xl font-bold md:text-2xl">{local.name}</h2>
                <Show when={local.badge}>{local.badge}</Show>
              </div>

              <Show when={local.subtitle}>
                <p class="text-muted-foreground text-sm">{local.subtitle}</p>
              </Show>

              <Show when={local.bio}>
                <p class="text-muted-foreground text-sm">{local.bio}</p>
              </Show>

              <Show when={local.infoItems}>
                <div
                  data-slot="profile-info"
                  class="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm"
                >
                  {local.infoItems}
                </div>
              </Show>
            </div>

            {/* Actions */}
            <Show when={local.actions}>
              <div data-slot="profile-actions" class="flex shrink-0 items-center gap-2">
                {local.actions}
              </div>
            </Show>
          </div>

          {/* Stats row */}
          <Show when={local.stats?.length}>
            <div data-slot="profile-stats" class="border-t pt-4">
              <div class="flex flex-wrap gap-6 md:gap-8">
                <For each={local.stats}>
                  {stat => (
                    <div class="flex flex-col items-center gap-0.5">
                      <span class="text-lg font-bold md:text-xl">{stat.value}</span>
                      <span class="text-muted-foreground text-xs md:text-sm">{stat.label}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Show when={local.tabs?.length}>
        <Tabs defaultValue={local.activeTab ?? local.tabs![0]?.id} onChange={local.onTabChange}>
          <TabsList
            class="grid w-full"
            style={{ 'grid-template-columns': `repeat(${local.tabs!.length}, minmax(0, 1fr))` }}
          >
            <For each={local.tabs}>
              {tab => <TabsTrigger value={tab.id}>{tab.label}</TabsTrigger>}
            </For>
            <TabsIndicator />
          </TabsList>
          <For each={local.tabs}>
            {tab => (
              <TabsContent value={tab.id} class="mt-4">
                {tab.body}
              </TabsContent>
            )}
          </For>
        </Tabs>
      </Show>
    </div>
  )
}
