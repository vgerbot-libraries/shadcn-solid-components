import { cx } from 'shadcn-solid-components/lib/cva'
import type { JSX, ParentProps } from 'solid-js'

export type MobileDeviceFrameProps = ParentProps<{
  class?: string
}>

export const MobileDeviceFrame = (props: MobileDeviceFrameProps) => {
  return (
    <div
      data-slot="mobile-device-frame"
      class={cx(
        'border-foreground/15 bg-background relative mx-auto flex h-[44rem] w-[22.5rem] flex-col overflow-hidden rounded-[2.25rem] border-[10px] shadow-2xl',
        props.class,
      )}
    >
      <div
        data-slot="mobile-device-status-bar"
        class="text-foreground flex h-11 shrink-0 items-center justify-between px-6 text-[11px] font-medium"
      >
        <span>9:41</span>
        <span class="bg-foreground absolute top-2 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full" />
        <span class="flex items-center gap-1">
          <span class="inline-block h-2 w-3 rounded-[1px] border border-current" />
          <span class="inline-block h-2 w-4 rounded-[1px] border border-current" />
        </span>
      </div>
      <div data-slot="mobile-device-screen" class="min-h-0 flex-1 overflow-hidden">
        {props.children as JSX.Element}
      </div>
    </div>
  )
}
