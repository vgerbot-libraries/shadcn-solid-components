import { StatusIndicator } from 'shadcn-solid-components/components/status-indicator'

const StatusIndicatorDemo = () => {
  return (
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="online" />
        <span>Online</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="away" />
        <span>Away</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="busy" />
        <span>Busy</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="offline" />
        <span>Offline</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="in-progress" />
        <span>In Progress</span>
      </div>
    </div>
  )
}

export default StatusIndicatorDemo
