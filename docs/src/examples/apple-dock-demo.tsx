import { For } from "solid-js"

import { AppleDock, AppleDockIcon } from "shadcn-solid-components/components/apple-dock"

const apps = [
  { label: "Mail", color: "bg-blue-500" },
  { label: "Calendar", color: "bg-orange-500" },
  { label: "Notes", color: "bg-yellow-500" },
  { label: "Music", color: "bg-pink-500" },
  { label: "Settings", color: "bg-zinc-500" },
]

const AppleDockDemo = () => {
  return (
    <AppleDock class="border-border bg-background rounded-xl">
      <For each={apps}>
        {(app) => (
          <AppleDockIcon class="rounded-xl" title={app.label}>
            <div
              class={`text-primary-foreground grid size-full place-items-center rounded-lg text-[10px] font-semibold ${app.color}`}
            >
              {app.label.slice(0, 2)}
            </div>
          </AppleDockIcon>
        )}
      </For>
    </AppleDock>
  )
}

export default AppleDockDemo
