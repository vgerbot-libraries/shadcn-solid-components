import { Avatar, AvatarFallback, AvatarImage } from 'shadcn-solid-components/components/avatar'
import { StatusDot } from 'shadcn-solid-components/components/status-indicator'

const users = [
  {
    name: 'Ava Chen',
    initials: 'AC',
    src: 'https://i.pravatar.cc/80?img=5',
    status: 'online' as const,
  },
  {
    name: 'Noah Kim',
    initials: 'NK',
    src: 'https://i.pravatar.cc/80?img=12',
    status: 'away' as const,
  },
  {
    name: 'Mia Lewis',
    initials: 'ML',
    src: 'https://i.pravatar.cc/80?img=23',
    status: 'busy' as const,
  },
  {
    name: 'Liam Wong',
    initials: 'LW',
    src: 'https://i.pravatar.cc/80?img=31',
    status: 'offline' as const,
  },
]

const StatusIndicatorWithAvatarDemo = () => {
  return (
    <div class="grid w-full gap-3 sm:grid-cols-2">
      {users.map(user => (
        <div class="flex items-center gap-3 rounded-lg border p-3">
          <div class="relative">
            <Avatar src={user.src} class="size-10">
              <AvatarImage alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <StatusDot
              status={user.status}
              class="absolute -right-0.5 -bottom-0.5 border-2 border-background"
            />
          </div>
          <div class="text-sm">
            <p class="font-medium leading-none">{user.name}</p>
            <p class="text-muted-foreground mt-1 capitalize">{user.status.replace('-', ' ')}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusIndicatorWithAvatarDemo
