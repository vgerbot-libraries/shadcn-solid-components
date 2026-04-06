import { ConfigProvider, useLocale } from "shadcn-solid-components/components/config-provider"

const LocaleEcho = () => {
  const locale = useLocale()
  const value = locale.locale ?? "(not set; useLocale() returns an empty object outside a provider)"
  return (
    <p class="text-muted-foreground text-sm">
      <span class="text-foreground font-medium">useLocale().locale:</span>{" "}
      {value}
    </p>
  )
}

/** Compare useLocale() with and without a provider. */
const ConfigProviderContrastDemo = () => {
  return (
    <div class="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <div class="border-border bg-card space-y-2 rounded-xl border p-4">
        <p class="text-foreground text-sm font-medium">Without ConfigProvider</p>
        <p class="text-muted-foreground text-xs">
          Child components can still call <code class="text-foreground">useLocale()</code>, which
          returns <code class="text-foreground">{"{}"}</code>.
        </p>
        <LocaleEcho />
      </div>
      <div class="border-border bg-card space-y-2 rounded-xl border p-4">
        <p class="text-foreground text-sm font-medium">Wrapped with ConfigProvider</p>
        <ConfigProvider locale={{ locale: "en-GB" }}>
          <p class="text-muted-foreground text-xs">
            The provided <code class="text-foreground">locale</code> becomes the context value for
            the subtree.
          </p>
          <LocaleEcho />
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ConfigProviderContrastDemo
