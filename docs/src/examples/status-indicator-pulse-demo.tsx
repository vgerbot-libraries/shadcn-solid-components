import { StatusIndicator } from 'shadcn-solid-components/components/status-indicator'

const StatusIndicatorPulseDemo = () => {
  return (
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="in-progress" pulse />
        <span>Background sync is running</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="online" pulse />
        <span>Realtime connection is active</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <StatusIndicator status="busy" size="md" pulse />
        <span>Deployment is processing</span>
      </div>
    </div>
  )
}

export default StatusIndicatorPulseDemo
