import type { ComponentProps, JSX } from "solid-js"
import { Match, Show, Switch, splitProps } from "solid-js"

type MDXComponents = {
  [Key in keyof JSX.IntrinsicElements]: (
    props: JSX.IntrinsicElements[Key],
  ) => JSX.Element
}

const Callout = (props: ComponentProps<"div">) => {
  return (
    <div
      class="border-border bg-muted/40 my-6 rounded-xl border px-4 py-3 text-sm"
      {...props}
    />
  )
}

const ComponentPreview = (props: ComponentProps<"section"> & { name?: string }) => {
  const [local, rest] = splitProps(props, ["name", "children"])

  return (
    <section class="border-border my-6 overflow-hidden rounded-2xl border" {...rest}>
      <div class="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        <span>Preview</span>
        <Show when={local.name}>
          <span>{local.name}</span>
        </Show>
      </div>
      <div class="bg-background px-4 py-6">{local.children}</div>
    </section>
  )
}

const ComponentInstallation = (props: ComponentProps<"div">) => {
  return <div class="space-y-4" {...props} />
}

const ComponentSourceTabs = (props: ComponentProps<"div">) => {
  return <div class="space-y-3" {...props} />
}

const ComponentSource = (props: ComponentProps<"div">) => {
  return (
    <div class="border-border bg-muted/30 my-6 rounded-xl border p-4 text-sm" {...props} />
  )
}

export const mdxCustomComponents: MDXComponents | Record<string, unknown> = {
  a: (props) => <a class="text-foreground font-medium underline underline-offset-4" {...props} />,
  h1: (props) => (
    <h1 class="mt-2 scroll-m-28 text-4xl font-semibold tracking-tight sm:text-3xl" {...props} />
  ),
  h2: (props) => (
    <h2 class="mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0" {...props} />
  ),
  h3: (props) => <h3 class="mt-8 scroll-m-28 text-xl font-semibold tracking-tight" {...props} />,
  h4: (props) => <h4 class="mt-6 scroll-m-28 text-lg font-semibold tracking-tight" {...props} />,
  p: (props) => <p class="leading-7 not-first:mt-6" {...props} />,
  ul: (props) => <ul class="my-6 ml-6 list-disc space-y-2" {...props} />,
  ol: (props) => <ol class="my-6 ml-6 list-decimal space-y-2" {...props} />,
  li: (props) => <li {...props} />,
  blockquote: (props) => (
    <blockquote class="border-border text-muted-foreground my-6 border-l-2 pl-6 italic" {...props} />
  ),
  hr: (props) => <hr class="border-border my-8" {...props} />,
  table: (props) => (
    <div class="my-6 w-full overflow-x-auto">
      <table class="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => <th class="border-border border-b px-4 py-2 text-left font-medium" {...props} />,
  td: (props) => <td class="border-border border-b px-4 py-2 align-top" {...props} />,
  pre: (props) => (
    <pre
      class="bg-muted/60 no-scrollbar my-6 overflow-x-auto rounded-2xl px-4 py-4 text-sm"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code"> & { __raw__?: string }) => {
    const [local, rest] = splitProps(props, ["class", "__raw__"])

    return (
      <Switch
        fallback={
          <code
            class="bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-[0.85em]"
            {...rest}
          />
        }
      >
        <Match when={Boolean(local.__raw__)}>
          <code class={local.class} {...rest} />
        </Match>
      </Switch>
    )
  },
  Step: (props: ComponentProps<"div">) => (
    <div class="[counter-reset:step] space-y-6 [&_h3]:first:mt-0" {...props} />
  ),
  StepItem: (props: ComponentProps<"h3">) => (
    <h3 class="mt-8 text-xl font-semibold tracking-tight" {...props} />
  ),
  Callout,
  ComponentPreview,
  ComponentInstallation,
  ComponentSourceTabs,
  ComponentSource,
}
