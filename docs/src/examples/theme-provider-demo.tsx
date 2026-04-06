import { For } from "solid-js"

import { Button } from "shadcn-solid-components/components/button"
import { ThemeProvider } from "shadcn-solid-components/components/theme"
import type { RadiusValue } from "shadcn-solid-components/lib/theme-context"
import { useTheme } from "shadcn-solid-components/lib/use-theme"

const radii: RadiusValue[] = ["none", "sm", "md", "lg", "xl", "full"]

const ThemePanel = () => {
  const { theme, setRadius, getRadiusClass } = useTheme()

  return (
    <div class="border-border bg-card max-w-lg space-y-4 rounded-xl border p-4">
      <p class="text-muted-foreground text-sm">
        Current <code class="text-foreground">base.radius</code>:
        <span class="text-foreground ml-1 font-mono text-xs">{theme.base.radius}</span>
      </p>
      <div class="flex flex-wrap gap-2">
        <For each={radii}>
          {(r) => (
            <Button
              size="sm"
              variant={theme.base.radius === r ? "default" : "outline"}
              onClick={() => {
                setRadius(r)
              }}
            >
              {r}
            </Button>
          )}
        </For>
      </div>
      <div
        class={`border-border bg-muted/50 text-muted-foreground border p-3 text-xs ${getRadiusClass("display")}`}
      >
        This preview container uses{" "}
        <code class="text-foreground">getRadiusClass(&quot;display&quot;)</code> to stay aligned
        with the current theme radius.
      </div>
    </div>
  )
}

/** Wrap the demo in its own provider to isolate it from the docs app shell. */
const ThemeProviderDemo = () => {
  return (
    <ThemeProvider defaultTheme={{ base: { radius: "md" } }}>
      <ThemePanel />
    </ThemeProvider>
  )
}

export default ThemeProviderDemo
