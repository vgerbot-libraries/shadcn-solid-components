import { ConfigProvider, useLocale } from "shadcn-solid-components/components/config-provider"

const LocaleEcho = () => {
  const locale = useLocale()
  return (
    <p class="text-muted-foreground text-sm">
      <span class="text-foreground font-medium">useLocale().locale:</span>{" "}
      {locale.locale ?? "(not set)"}
    </p>
  )
}

const ConfigProviderDemo = () => {
  return (
    <ConfigProvider locale={{ locale: "en-GB" }}>
      <div class="border-border bg-card max-w-md space-y-2 rounded-xl border p-4">
        <p class="text-sm">
          The subtree is wrapped in <code class="text-foreground">ConfigProvider</code>, and child
          components read the merged locale via{" "}
          <code class="text-foreground">useLocale()</code>.
        </p>
        <LocaleEcho />
      </div>
    </ConfigProvider>
  )
}

export default ConfigProviderDemo
