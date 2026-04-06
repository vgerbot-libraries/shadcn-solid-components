import { ConfigProvider, useLocale } from "shadcn-solid-components/components/config-provider"

const LocaleEcho = (props: { label: string }) => {
  const locale = useLocale()
  return (
    <p class="text-muted-foreground text-sm">
      <span class="text-foreground font-medium">{props.label}</span>{" "}
      <code class="text-foreground font-mono text-xs">{locale.locale ?? "(no locale field)"}</code>
    </p>
  )
}

/** Each ConfigProvider supplies an independent context value to its subtree. */
const ConfigProviderScopingDemo = () => {
  return (
    <div class="border-border bg-card max-w-lg space-y-4 rounded-xl border p-4 text-sm">
      <p class="text-muted-foreground">
        The outer provider sets <code class="text-foreground">en-GB</code>; nested providers can
        override it with another locale or an empty object.
      </p>
      <ConfigProvider locale={{ locale: "en-GB" }}>
        <div class="space-y-2 border-l-2 border-primary/40 pl-3">
          <LocaleEcho label="Outer subtree:" />
          <ConfigProvider locale={{ locale: "zh-CN" }}>
            <div class="border-border space-y-2 border-l-2 pl-3">
              <LocaleEcho label="Inner override:" />
            </div>
          </ConfigProvider>
          <ConfigProvider locale={{}}>
            <div class="border-border space-y-2 border-l-2 pl-3">
              <LocaleEcho label="Inner empty object:" />
            </div>
          </ConfigProvider>
        </div>
      </ConfigProvider>
    </div>
  )
}

export default ConfigProviderScopingDemo
