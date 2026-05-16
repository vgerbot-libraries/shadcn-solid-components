import { For } from "solid-js"

import { Button } from "shadcn-solid-components/components/button"
import { PageLayout, PageLayoutHeader } from "shadcn-solid-components/components/page-layout"

const cards = [
  "Revenue +18%",
  "Conversion 3.4%",
  "Active users 12.8k",
  "Errors 0.12%",
]

const PageLayoutDemo = () => {
  return (
    <div class="h-[360px] overflow-hidden rounded-lg border">
      <PageLayout
        header={
          <PageLayoutHeader
            content={<h3 class="truncate text-sm font-semibold">Dashboard Overview</h3>}
            actions={<Button size="sm">Export</Button>}
          />
        }
      >
        <div class="grid gap-3 md:grid-cols-2">
          <For each={cards}>
            {(card) => <div class="rounded-lg border p-4 text-sm">{card}</div>}
          </For>
        </div>
      </PageLayout>
    </div>
  )
}

export default PageLayoutDemo
