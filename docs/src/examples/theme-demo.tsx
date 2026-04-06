import { Button } from "shadcn-solid-components/components/button"
import { ThemeProvider } from "shadcn-solid-components/components/theme"
import { useTheme } from "shadcn-solid-components/lib/use-theme"

const RadiusPreview = () => {
  const { theme, getRadiusClass } = useTheme()
  return (
    <div class="flex flex-col gap-3">
      <p class="text-muted-foreground text-sm">
        Current radius token:{" "}
        <span class="text-foreground font-mono">{theme.base.radius}</span>
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Button class={getRadiusClass("form-control")}>Form control</Button>
        <Button variant="outline" class={getRadiusClass("display")}>
          Display
        </Button>
      </div>
    </div>
  )
}

const ThemeDemo = () => (
  <ThemeProvider defaultTheme={{ base: { radius: "lg" } }}>
    <div class="border-border rounded-lg border p-4">
      <RadiusPreview />
    </div>
  </ThemeProvider>
)

export default ThemeDemo
