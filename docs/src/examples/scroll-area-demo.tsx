import { ScrollArea } from 'shadcn-solid-components/components/scroll-area'
import { Separator } from 'shadcn-solid-components/components/separator'
import { For } from 'solid-js'

const tags = Array.from({ length: 36 }, (_, index) => `v1.2.0-beta.${36 - index}`)

const ScrollAreaDemo = () => {
  return (
    <ScrollArea class="h-72 w-52 rounded-md border">
      <div class="p-4">
        <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
        <For each={tags}>
          {tag => (
            <>
              <div class="text-sm">{tag}</div>
              <Separator class="my-2" />
            </>
          )}
        </For>
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaDemo
