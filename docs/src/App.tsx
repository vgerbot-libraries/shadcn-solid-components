import { A, Navigate, Route, Router, useLocation, useParams } from "@solidjs/router"
// @ts-expect-error solid-mdx does not expose compatible types here.
import { MDXProvider } from "solid-mdx"
import { For, Show, createEffect, createMemo } from "solid-js"

import { Button, buttonVariants } from "shadcn-solid-components/components/button"
import { Separator } from "shadcn-solid-components/components/separator"
import { ModeToggleDropdown } from "shadcn-solid-components/hoc/mode-toggle-dropdown"
import { cx } from "shadcn-solid-components/lib"

import { mdxCustomComponents } from "@docs/components/mdx"
import { Contents, docsNavigation } from "@docs/content"

type DocRouteParams = {
  slug?: string
}

const siteTitle = "shadcn-solid-components Docs"
const siteDescription =
  "Documentation infrastructure for shadcn-solid-components. Content can be added incrementally with MDX."

const setDocumentMeta = (title: string, description: string) => {
  document.title = title

  const metaDescription =
    document.querySelector('meta[name="description"]') ??
    document.head.appendChild(document.createElement("meta"))

  metaDescription.setAttribute("name", "description")
  metaDescription.setAttribute("content", description)
}

const HomePage = () => {
  createEffect(() => {
    setDocumentMeta(siteTitle, siteDescription)
  })

  return (
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-16 sm:px-8 lg:px-12">
      <div class="border-border bg-muted/30 max-w-4xl rounded-3xl border p-8 sm:p-12">
        <p class="text-muted-foreground text-sm uppercase tracking-[0.2em]">Docs Infrastructure</p>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Documentation foundation for `shadcn-solid-components`
        </h1>
        <p class="text-muted-foreground mt-6 max-w-2xl text-base leading-7">
          The docs app is wired with MDX, content indexing, navigation, and layout primitives.
          Add files under <code>docs/src/content/docs</code> to publish documentation pages.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <A href="/docs" class={buttonVariants({ size: "sm" })}>
            Open docs
          </A>
          <a
            href="https://github.com/vgerbot-libraries/shadcn-solid-components"
            target="_blank"
            rel="noreferrer"
            class={cx(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Repository
          </a>
        </div>
      </div>
    </div>
  )
}

const DocsEmptyState = () => {
  return (
    <div class="border-border bg-muted/20 rounded-3xl border border-dashed p-8">
      <h2 class="text-2xl font-semibold tracking-tight">No documentation pages yet</h2>
      <p class="text-muted-foreground mt-3 max-w-2xl leading-7">
        Create an <code>.mdx</code> file in <code>docs/src/content/docs</code>. The sidebar, page
        metadata, and table of contents will update automatically.
      </p>
    </div>
  )
}

const TableOfContents = (props: { headings: Array<{ depth: number; slug: string; text: string }> }) => {
  const items = createMemo(() => props.headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3))

  return (
    <Show when={items().length}>
      <div class="space-y-3">
        <p class="text-foreground text-sm font-semibold">On this page</p>
        <nav class="space-y-2">
          <For each={items()}>
            {(heading) => (
              <a
                href={`#${heading.slug}`}
                class={cx(
                  "text-muted-foreground hover:text-foreground block text-sm transition-colors",
                  heading.depth === 3 && "pl-4",
                )}
              >
                {heading.text}
              </a>
            )}
          </For>
        </nav>
      </div>
    </Show>
  )
}

const DocsSidebar = () => {
  const location = useLocation()

  return (
    <aside class="border-border bg-background/80 w-full shrink-0 border-b backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div class="flex h-full flex-col">
        <div class="px-6 py-6">
          <A href="/docs" class="text-foreground text-lg font-semibold tracking-tight">
            Documentation
          </A>
          <p class="text-muted-foreground mt-2 text-sm">
            MDX-driven docs navigation generated from the content directory.
          </p>
        </div>
        <Separator />
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <Show when={docsNavigation.length} fallback={<p class="text-muted-foreground px-2 text-sm">Waiting for content.</p>}>
            <nav class="space-y-6">
              <For each={docsNavigation}>
                {(section) => (
                  <section>
                    <p class="text-muted-foreground px-2 text-xs font-semibold uppercase tracking-[0.2em]">
                      {section.title}
                    </p>
                    <div class="mt-2 space-y-1">
                      <For each={section.items}>
                        {(item) => (
                          <A
                            href={item.href}
                            class={cx(
                              "block rounded-xl px-3 py-2 text-sm transition-colors",
                              location.pathname === item.href
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                            )}
                          >
                            <div class="flex items-center justify-between gap-3">
                              <span>{item.title}</span>
                              <Show when={item.status}>
                                <span class="border-border bg-background rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                                  {item.status}
                                </span>
                              </Show>
                            </div>
                          </A>
                        )}
                      </For>
                    </div>
                  </section>
                )}
              </For>
            </nav>
          </Show>
        </div>
      </div>
    </aside>
  )
}

const DocsIndexPage = () => {
  createEffect(() => {
    setDocumentMeta(`${siteTitle} | Overview`, siteDescription)
  })

  return (
    <div class="flex-1 px-6 py-10 sm:px-8 lg:px-12">
      <div class="mx-auto max-w-4xl space-y-8">
        <div class="space-y-4">
          <p class="text-muted-foreground text-sm uppercase tracking-[0.2em]">Overview</p>
          <h1 class="text-4xl font-semibold tracking-tight">Docs base is ready</h1>
          <p class="text-muted-foreground max-w-2xl leading-7">
            This app already includes routing, MDX rendering, generated content indexing, a docs
            sidebar, and an optional table of contents. Add or organize content later without
            changing the shell.
          </p>
        </div>

        <Show when={docsNavigation.length} fallback={<DocsEmptyState />}>
          <div class="grid gap-4 sm:grid-cols-2">
            <For each={docsNavigation}>
              {(section) => (
                <section class="border-border rounded-2xl border p-5">
                  <h2 class="text-lg font-semibold">{section.title}</h2>
                  <p class="text-muted-foreground mt-2 text-sm">
                    {section.items.length} page{section.items.length === 1 ? "" : "s"}
                  </p>
                  <div class="mt-4 space-y-2">
                    <For each={section.items.slice(0, 4)}>
                      {(item) => (
                        <A href={item.href} class="text-foreground hover:text-primary block text-sm underline-offset-4 hover:underline">
                          {item.title}
                        </A>
                      )}
                    </For>
                  </div>
                </section>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}

const DocsPage = () => {
  const params = useParams<DocRouteParams>()
  const slug = createMemo(() => params.slug ?? "")
  const doc = createMemo(() => Contents[slug()])

  createEffect(() => {
    if (!doc()) {
      setDocumentMeta(`${siteTitle} | Not Found`, "The requested documentation page does not exist.")
      return
    }

    setDocumentMeta(`${doc()!.data.title} | ${siteTitle}`, doc()!.data.description || siteDescription)
  })

  const DocComponent = createMemo(() => doc()?.component)

  return (
    <Show
      when={doc()}
      fallback={
        <div class="px-6 py-10 sm:px-8 lg:px-12">
          <div class="mx-auto max-w-3xl">
            <DocsEmptyState />
          </div>
        </div>
      }
    >
      {(entry) => (
        <div class="flex-1 xl:grid xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12">
          <div class="min-w-0 px-6 py-10 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-3xl">
              <div class="space-y-4">
                <h1 class="text-4xl font-semibold tracking-tight">{entry().data.title}</h1>
                <Show when={entry().data.description}>
                  <p class="text-muted-foreground max-w-2xl leading-7">{entry().data.description}</p>
                </Show>
              </div>
              <div class="docs-content mt-10 min-w-0">
                <MDXProvider components={mdxCustomComponents}>
                  <Show when={DocComponent()} keyed>
                    {(Component) => <Component />}
                  </Show>
                </MDXProvider>
              </div>
            </div>
          </div>
          <Show when={entry().data.toc && entry().headings.length}>
            <aside class="hidden xl:block">
              <div class="sticky top-10 pr-8 pt-10">
                <TableOfContents headings={entry().headings} />
              </div>
            </aside>
          </Show>
        </div>
      )}
    </Show>
  )
}

const DocsLayout = (props: { children?: import("solid-js").JSX.Element }) => {
  return (
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
      <DocsSidebar />
      <div class="min-w-0 flex-1">{props.children}</div>
    </div>
  )
}

const AppShell = (props: { children?: import("solid-js").JSX.Element }) => {
  return (
    <div class="bg-background text-foreground flex min-h-screen flex-col">
      <header class="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <div class="flex items-center gap-6">
            <A href="/" class="text-foreground text-base font-semibold tracking-tight">
              shadcn-solid-components
            </A>
            <nav class="hidden items-center gap-4 text-sm md:flex">
              <A href="/" class="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </A>
              <A href="/docs" class="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </A>
            </nav>
          </div>
          <ModeToggleDropdown trigger={{ class: "w-9 px-0" }} />
        </div>
      </header>
      <main class="flex flex-1">{props.children}</main>
      <footer class="border-border border-t">
        <div class="text-muted-foreground mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 text-sm sm:px-8 lg:px-12">
          <span>Docs infrastructure ready for incremental MDX content.</span>
          <Button
            as="a"
            href="/docs"
            variant="ghost"
            size="sm"
            class="hidden sm:inline-flex"
          >
            Browse docs
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Router root={AppShell}>
      <Route path="/" component={HomePage} />
      <Route path="/docs" component={DocsLayout}>
        <Route path="/" component={DocsIndexPage} />
        <Route path="*slug" component={DocsPage} />
      </Route>
      <Route path="*all" component={() => <Navigate href="/" />} />
    </Router>
  )
}
