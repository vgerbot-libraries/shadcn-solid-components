import { useNavigate } from '@solidjs/router'
import { For } from 'solid-js'
import { AppleDock, AppleDockIcon } from 'shadcn-solid-components/components/apple-dock'
import { Badge } from 'shadcn-solid-components/components/badge'
import {
  IconArrowRight,
  IconBell,
  IconFile,
  IconHome,
  IconLock,
  IconSettings,
  IconX,
} from 'shadcn-solid-components/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn-solid-components/components/popover'
import { Separator } from 'shadcn-solid-components/components/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn-solid-components/components/tooltip'

const dockItems = [
  { icon: IconFile, label: 'Docs', path: '/general' },
  { icon: IconHome, label: 'Dashboard', path: '/' },
  { icon: IconSettings, label: 'Settings', path: '/settings' },
  { icon: IconLock, label: 'Security', path: '/overlay' },
]

const notifications = [
  { title: 'AppleDock component is now available', time: '2m ago', unread: true },
  { title: 'ColorPicker has been updated to v2.0', time: '1h ago', unread: true },
  { title: 'New theme preset "Ocean" was published', time: '3h ago', unread: false },
]

export function AppDock() {
  const navigate = useNavigate()

  return (
    <div class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <AppleDock disableMagnification iconDistance={140}>
        <Popover placement="top">
          <PopoverTrigger as={AppleDockIcon} class="relative">
            <IconBell class="size-5" />
            <span class="pointer-events-none absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">2</span>
          </PopoverTrigger>
          <PopoverContent class="w-72 overflow-hidden p-0">
            <div class="flex items-center justify-between border-b px-4 py-3">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">Notifications</p>
                <Badge variant="secondary" class="h-5 px-1.5 text-xs">2</Badge>
              </div>
              <button type="button" class="inline-flex size-6 cursor-pointer items-center justify-center rounded-full p-1 transition-colors hover:bg-muted hover:text-foreground">
                <IconX class="size-4" />
              </button>
            </div>
            <div class="p-4">
              <div class="flex flex-col gap-1">
                <For each={notifications}>
                  {n => (
                    <div class="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                      <span class={`mt-1.5 size-2 shrink-0 rounded-full ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                      <div class="flex-1">
                        <p class="text-sm leading-snug">{n.title}</p>
                        <p class="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  )}
                </For>
                <button type="button" class="mt-1 flex h-7 w-full items-center justify-center gap-1 rounded-md px-2.5 text-xs transition-colors hover:bg-muted hover:text-foreground">
                  Mark all as read
                </button>
              </div>
              <Separator class="my-3" />
              <a href="#" class="flex items-center justify-between text-xs text-muted-foreground transition-colors hover:text-foreground">
                View all notifications
                <IconArrowRight class="size-3" />
              </a>
            </div>
          </PopoverContent>
        </Popover>
        <For each={dockItems}>
          {item => (
            <Tooltip placement="top">
              <TooltipTrigger as={AppleDockIcon} onClick={() => navigate(item.path)}>
                <item.icon class="size-5" />
              </TooltipTrigger>
              <TooltipContent class="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )}
        </For>
      </AppleDock>
    </div>
  )
}
