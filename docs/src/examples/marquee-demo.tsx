import { For } from "solid-js"

import { Marquee } from "shadcn-solid-components/components/marquee"

const badges = ["SolidJS", "TypeScript", "Tailwind", "Kobalte", "Vite", "Biome"]

const MarqueeDemo = () => {
  return (
    <Marquee class="[--duration:24s] [--gap:0.75rem]">
      <For each={badges}>
        {(badge) => (
          <div class="rounded-component border bg-muted px-3 py-1 text-sm font-medium">
            {badge}
          </div>
        )}
      </For>
    </Marquee>
  )
}

export default MarqueeDemo
