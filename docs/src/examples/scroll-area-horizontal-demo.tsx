import { ScrollArea, ScrollAreaScrollbar } from 'shadcn-solid-components/components/scroll-area'
import { For } from 'solid-js'

const works = [
  { artist: 'Ornella Binni', color: 'from-blue-500/30 to-cyan-500/20' },
  { artist: 'Tom Byrom', color: 'from-violet-500/30 to-fuchsia-500/20' },
  { artist: 'Vladimir Malyavko', color: 'from-amber-500/30 to-orange-500/20' },
  { artist: 'Aline Caster', color: 'from-emerald-500/30 to-lime-500/20' },
  { artist: 'Mina Park', color: 'from-rose-500/30 to-pink-500/20' },
]

const ScrollAreaHorizontalDemo = () => {
  return (
    <ScrollArea class="w-full max-w-xl rounded-md border whitespace-nowrap">
      <div class="flex w-max space-x-4 p-4">
        <For each={works}>
          {artwork => (
            <figure class="shrink-0">
              <div
                class={`h-36 w-56 overflow-hidden rounded-md border bg-linear-to-br ${artwork.color}`}
              />
              <figcaption class="text-muted-foreground pt-2 text-xs">
                Photo by <span class="text-foreground font-semibold">{artwork.artist}</span>
              </figcaption>
            </figure>
          )}
        </For>
      </div>
      <ScrollAreaScrollbar orientation="horizontal" />
    </ScrollArea>
  )
}

export default ScrollAreaHorizontalDemo
