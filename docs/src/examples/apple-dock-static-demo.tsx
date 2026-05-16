import { For } from "solid-js"

import { AppleDock, AppleDockIcon } from "shadcn-solid-components/components/apple-dock"

const actions = ["Upload", "Share", "Export", "Archive"]

const AppleDockStaticDemo = () => {
  return (
    <AppleDock
      disableMagnification
      direction="bottom"
      class="border-border bg-background rounded-xl"
    >
      <For each={actions}>
        {(action) => (
          <AppleDockIcon disableMagnification class="rounded-lg border bg-muted px-3">
            <span class="text-xs font-medium">{action}</span>
          </AppleDockIcon>
        )}
      </For>
    </AppleDock>
  )
}

export default AppleDockStaticDemo
