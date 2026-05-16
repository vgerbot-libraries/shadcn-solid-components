import { For } from "solid-js"

import { Marquee } from "shadcn-solid-components/components/marquee"

const items = ["Deploy finished", "3 new signups", "Payment received", "Backup completed"]

const MarqueeVerticalDemo = () => {
  return (
    <div class="h-40 overflow-hidden rounded-lg border p-2">
      <Marquee
        vertical
        reverse
        repeat={3}
        class="h-full [--duration:16s] [--gap:0.5rem]"
      >
        <For each={items}>
          {(item) => <div class="rounded-md bg-muted px-3 py-2 text-sm">{item}</div>}
        </For>
      </Marquee>
    </div>
  )
}

export default MarqueeVerticalDemo
