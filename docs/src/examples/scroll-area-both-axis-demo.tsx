import { ScrollArea, ScrollAreaScrollbar } from 'shadcn-solid-components/components/scroll-area'
import { For } from 'solid-js'

const columns = Array.from({ length: 12 }, (_, index) => `Column ${index + 1}`)
const rows = Array.from({ length: 16 }, (_, index) => `Row ${index + 1}`)

const ScrollAreaBothAxisDemo = () => {
  return (
    <ScrollArea class="h-72 w-full max-w-xl rounded-md border">
      <div class="w-[780px] p-4">
        <div class="grid grid-cols-12 gap-2 text-xs">
          <For each={columns}>{column => <div class="font-medium">{column}</div>}</For>
        </div>
        <div class="mt-3 space-y-2">
          <For each={rows}>
            {row => (
              <div class="grid grid-cols-12 gap-2 text-xs">
                <For each={columns}>
                  {(_, columnIndex) => (
                    <div class="bg-muted/40 rounded-component px-2 py-1.5">
                      {row} / C{columnIndex() + 1}
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
      <ScrollAreaScrollbar orientation="horizontal" />
    </ScrollArea>
  )
}

export default ScrollAreaBothAxisDemo
