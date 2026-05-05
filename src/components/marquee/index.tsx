import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, For, mergeProps, splitProps } from 'solid-js'
import './index.css'

export type MarqueeProps = ComponentProps<'div'> & {
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

export const Marquee = (props: MarqueeProps) => {
  const merge = mergeProps(
    {
      reverse: false,
      pauseOnHover: false,
      vertical: false,
      repeat: 4,
    } as MarqueeProps,
    props,
  )

  const [local, rest] = splitProps(merge, [
    'class',
    'reverse',
    'pauseOnHover',
    'children',
    'vertical',
    'repeat',
  ])

  const componentClass = useComponentClass(ComponentName.Marquee, merge)
  const repeatCount = () => Math.max(1, Math.floor(local.repeat ?? 4))

  return (
    <div
      data-slot="marquee"
      class={cx(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        local.vertical ? 'flex-col' : 'flex-row',
        componentClass,
        local.class,
      )}
      {...rest}
    >
      <For each={Array.from({ length: repeatCount() })}>
        {() => (
          <div
            data-slot="marquee-content"
            class={cx(
              'flex shrink-0 justify-around [gap:var(--gap)]',
              local.vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
              local.pauseOnHover && 'marquee-content-pause-on-hover',
              local.reverse && 'direction-[reverse]',
            )}
          >
            {local.children}
          </div>
        )}
      </For>
    </div>
  )
}
