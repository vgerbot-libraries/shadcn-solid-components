import { A, Navigate, Route, Router, useLocation, useParams } from "@solidjs/router"
// @ts-expect-error solid-mdx does not expose compatible types here.
import { MDXProvider } from "solid-mdx"
import MiniSearch from "minisearch"
import { For, Show, createEffect, createMemo, createSignal } from "solid-js"

import { Button, buttonVariants } from "shadcn-solid-components/components/button"
import { Separator } from "shadcn-solid-components/components/separator"
import { TextField, TextFieldInput } from "shadcn-solid-components/components/text-field"
import { ModeToggleDropdown } from "shadcn-solid-components/hoc/mode-toggle-dropdown"
import { cx } from "shadcn-solid-components/lib/cva"

import { mdxCustomComponents } from "@docs/components/mdx"
import { Contents, docsNavigation } from "@docs/content"

import AccordionDemo from "./examples/accordion-demo"
import CalendarDemo from "./examples/calendar-demo"
import CardDemo from "./examples/card-demo"
import CommandDemo from "./examples/command-demo"
import LoginFormDemo from "./examples/login-form-demo"
import TabsDemo from "./examples/tabs-demo"

type DocRouteParams = {
  slug?: string
}

type DocsSearchItem = {
  id: string
  title: string
  href: string
  description: string
  section: string
  status?: string
  headings: string
}

const siteTitle = "shadcn-solid-components Docs"
const siteDescription =
  "Documentation infrastructure for shadcn-solid-components. Content can be added incrementally with MDX."
const routerBase = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "")

const setDocumentMeta = (title: string, description: string) => {
  document.title = title

  const metaDescription =
    document.querySelector('meta[name="description"]') ??
    document.head.appendChild(document.createElement("meta"))

  metaDescription.setAttribute("name", "description")
  metaDescription.setAttribute("content", description)
}

const docsSearchItems: DocsSearchItem[] = docsNavigation.flatMap((section) =>
  section.items.map((item) => {
    const slug = item.href.replace(/^\/docs\//, "")
    const entry = Contents[slug]

    return {
      id: item.href,
      title: item.title,
      href: item.href,
      description: item.description,
      section: section.title,
      status: item.status,
      headings: entry?.headings.map((heading) => heading.text).join(" ") ?? "",
    }
  }),
)

const docsSearch = new MiniSearch<DocsSearchItem>({
  idField: "id",
  fields: ["title", "description", "section", "headings"],
  storeFields: ["title", "href", "description", "section", "status"],
})

docsSearch.addAll(docsSearchItems)

const HomePage = () => {
  createEffect(() => {
    setDocumentMeta(siteTitle, siteDescription)
  })

  return (
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-16 sm:px-8 lg:px-12 text-center items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        {/* <a href="https://github.com/hngngn/shadcn-solid" target="_blank" rel="noreferrer" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <span class="mr-2">🎉</span>
          New Components: Kbd and Button Group
        </a> */}
        <h1 class="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          The Foundation for your Design System
        </h1>
        <p class="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.
        </p>
        <div class="flex items-center gap-4 mt-4 justify-center">
          <A href="/docs" class={buttonVariants({ size: "lg" })}>
            Get Started
          </A>
          <A href="/docs/components/accordion" class={buttonVariants({ size: "lg", variant: "outline" })}>
            View Components
          </A>
        </div>
      </div>

      <div class="mt-16 w-full max-w-5xl items-start justify-center relative">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div class="flex flex-col gap-6 items-center">
              <div class="w-full max-w-sm relative">
                <CardDemo />
              </div>
              <div class="w-full max-w-sm relative">
                 <TabsDemo />
              </div>
            </div>
            <div class="hidden md:flex md:flex-col gap-6 md:items-center">
              <div class="w-full max-w-sm relative">
                 <CalendarDemo />
              </div>
              <div class="w-full max-w-sm relative bg-card text-card-foreground shadow-sm rounded-xl">
                 <LoginFormDemo />
              </div>
            </div>
            <div class="hidden lg:flex lg:flex-col gap-6 lg:items-center">
              <div class="w-full max-w-sm relative">
                 <CommandDemo />
              </div>
              <div class="p-4 border rounded-xl w-full max-w-sm relative bg-card text-card-foreground shadow-sm">
                 <AccordionDemo />
              </div>
            </div>
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
  const [query, setQuery] = createSignal("")
  const trimmedQuery = createMemo(() => query().trim())

  const filteredSections = createMemo(() => {
    if (!trimmedQuery()) {
      return docsNavigation
    }

    const matches = docsSearch.search(trimmedQuery(), {
      prefix: true,
      fuzzy: 0.2,
      fields: ["title", "description", "section", "headings"],
    }) as unknown as DocsSearchItem[]

    const matchingHrefs = new Set(matches.map((item) => item.href))

    return docsNavigation
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => matchingHrefs.has(item.href)),
      }))
      .filter((section) => section.items.length > 0)
  })

  const resultCount = createMemo(() =>
    filteredSections().reduce((count, section) => count + section.items.length, 0),
  )

  return (
    <aside class="border-border bg-background/80 w-full shrink-0 border-b backdrop-blur lg:fixed lg:top-16 lg:left-[max(0px,calc((100vw-80rem)/2))] lg:h-[calc(100vh-4rem)] lg:w-72 lg:border-b-0 lg:border-r">
      <div class="flex h-full flex-col">
        <div class="px-6 py-6">
          <div class="space-y-3">
            <TextField>
              <TextFieldInput
                type="search"
                value={query()}
                onInput={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search docs..."
                aria-label="Search documentation"
              />
            </TextField>
            <Show when={trimmedQuery()}>
              <div class="text-muted-foreground flex items-center justify-between gap-3 px-1 text-xs">
                <span>
                  {resultCount()} result{resultCount() === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  class="hover:text-foreground transition-colors"
                  onClick={() => setQuery("")}
                >
                  Clear
                </button>
              </div>
            </Show>
          </div>
        </div>
        <Separator />
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <Show when={docsNavigation.length} fallback={<p class="text-muted-foreground px-2 text-sm">Waiting for content.</p>}>
            <Show
              when={filteredSections().length}
              fallback={
                <p class="text-muted-foreground px-2 text-sm">
                  No pages match <span class="text-foreground font-medium">{trimmedQuery()}</span>.
                </p>
              }
            >
            <nav class="space-y-6">
              <For each={filteredSections()}>
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
            A set of beautifully designed components that you can customize, extend, and build on.
          </p>

          <div class="pt-4 space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight">Installation</h2>
            <p class="text-muted-foreground">
              Install the package, then make sure the required peer dependencies are already configured in your app.
            </p>
            <pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>pnpm add shadcn-solid-components</code>
            </pre>
            <p class="text-muted-foreground">
              Peer dependencies: <code class="bg-muted px-1 py-0.5 rounded text-sm">solid-js</code>, <code class="bg-muted px-1 py-0.5 rounded text-sm">tailwindcss</code> (v4), and <code class="bg-muted px-1 py-0.5 rounded text-sm">tw-animate-css</code>.
            </p>
          </div>
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
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:pl-72">
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
    <Router root={AppShell} base={routerBase}>
      <Route path="/" component={HomePage} />
      <Route path="/docs" component={DocsLayout}>
        <Route path="/" component={DocsIndexPage} />
        <Route path="*slug" component={DocsPage} />
      </Route>
      <Route path="*all" component={() => <Navigate href="/" />} />
    </Router>
  )
}
