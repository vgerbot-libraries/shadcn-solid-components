import { A, Navigate, Route, Router, useLocation, useParams } from "@solidjs/router"
// @ts-expect-error solid-mdx does not expose compatible types here.
import { MDXProvider } from "solid-mdx"
import MiniSearch from "minisearch"
import { For, Show, createEffect, createMemo, createSignal } from "solid-js"

import { Button, buttonVariants } from "shadcn-solid-components/components/button"
import { LandingHero } from "shadcn-solid-components/components/landing-hero"
import { Separator } from "shadcn-solid-components/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "shadcn-solid-components/components/sidebar"
import { TextField, TextFieldInput } from "shadcn-solid-components/components/text-field"
import { ModeToggleDropdown } from "shadcn-solid-components/hoc/mode-toggle-dropdown"
import { SidebarMenuTree } from "shadcn-solid-components/hoc/sidebar-menu-tree"
import { cx } from "shadcn-solid-components/lib/cva"

import { mdxCustomComponents } from "@docs/components/mdx"
import { Contents, docsNavigation } from "@docs/content"

import AccordionDemo from "./examples/accordion-demo"
import AuthFormDemo from "./examples/auth-form-demo"
import CalendarDemo from "./examples/calendar-demo"
import CardDemo from "./examples/card-demo"
import CommandDemo from "./examples/command-demo"
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

const docsSearchItems: DocsSearchItem[] = docsNavigation.flatMap((section: any) =>
  section.items.map((item: any) => {
    const slug = item.href.replace(/^\/docs\//, "")
    const entry = Contents[slug]

    return {
      id: item.href,
      title: item.title,
      href: item.href,
      description: item.description,
      section: section.title,
      status: item.status,
      headings: entry?.headings?.map((heading: any) => heading.text).join(" ") ?? "",
    }
  }),
)

const docsSearch = new MiniSearch<DocsSearchItem>({
  idField: "id",
  fields: ["title", "description", "section", "headings"],
  storeFields: ["title", "href", "description", "section", "status"],
})

docsSearch.addAll(docsSearchItems)

const topNavItems = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
]

const HomePage = () => {
  createEffect(() => {
    setDocumentMeta(siteTitle, siteDescription)
  })

  return (
    <div class="mx-auto flex w-full max-w-9xl flex-1 flex-col px-6 py-16 sm:px-8 lg:px-12 text-center items-center justify-center">
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
                 <AuthFormDemo />
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
      .map((section: any) => ({
        ...section,
        items: section.items.filter((item: any) => matchingHrefs.has(item.href)),
      }))
      .filter((section: any) => section.items.length > 0)
  })

  const resultCount = createMemo(() =>
    filteredSections().reduce((count: number, section: any) => count + section.items.length, 0),
  )

  const toSidebarItems = (items: any[]) =>
    items.map((item: any) => ({
      title: item.title,
      url: item.href,
      badge: item.status
        ? {
            content: item.status,
            class: "text-[10px] uppercase tracking-[0.18em]",
          }
        : undefined,
    }))

  return (
    <Sidebar class="top-16 h-[calc(100svh-4rem)] border-r" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader class="px-4 py-4">
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
      </SidebarHeader>
      <Separator />
      <SidebarContent class="px-2 py-4">
        <Show
          when={docsNavigation.length}
          fallback={<p class="text-muted-foreground px-2 text-sm">Waiting for content.</p>}
        >
          <Show
            when={filteredSections().length}
            fallback={
              <p class="text-muted-foreground px-2 text-sm">
                No pages match <span class="text-foreground font-medium">{trimmedQuery()}</span>.
              </p>
            }
          >
            <For each={filteredSections()}>
              {(section) => (
                <SidebarGroup>
                  <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenuTree items={toSidebarItems(section.items)} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </For>
          </Show>
        </Show>
      </SidebarContent>
    </Sidebar>
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
              <code>pnpm add github:vgerbot-libraries/shadcn-solid-components</code>
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
    <div class="flex w-full flex-1 min-h-0">
      <DocsSidebar />
      <div class="min-w-0 flex-1 overflow-auto">{props.children}</div>
    </div>
  )
}

const AppFooter = (props: { isDocsRoute: boolean }) => {
  const { isMobile, open } = useSidebar()

  const footerClass = createMemo(() =>
    cx(
      "border-border border-t transition-[margin] duration-200 ease-linear",
      props.isDocsRoute && !isMobile() && open() && "md:ml-[var(--sidebar-width)]",
    ),
  )

  return (
    <footer class={footerClass()}>
      <div class="text-muted-foreground mx-auto flex w-full max-w-9xl items-center justify-between gap-4 px-6 py-4 text-sm sm:px-8 lg:px-12">
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
  )
}

const AppShell = (props: { children?: import("solid-js").JSX.Element }) => {
  const location = useLocation()
  const isDocsRoute = createMemo(() => location.pathname.startsWith("/docs"))

  return (
    <SidebarProvider>
      <div class="bg-background text-foreground flex h-svh w-full flex-col overflow-hidden">
        <LandingHero
          class="sticky top-0 z-40 border-border bg-background/80 backdrop-blur"
          containerClass={cx(
            isDocsRoute() ? "max-w-none px-4" : "mx-auto max-w-9xl px-4 sm:px-8 lg:px-12",
          )}
          brandLeading={
            <Show when={isDocsRoute()}>
              <SidebarTrigger />
            </Show>
          }
          brand={{
            title: "shadcn-solid-components",
            href: "/",
          }}
          navItems={topNavItems}
          secondaryActions={
            <>
              <Button
                as="a"
                href="https://github.com/vgerbot-libraries/shadcn-solid-components"
                variant="ghost"
                class="size-9 p-0"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  class="size-5"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.22.682-.49 0-.238-.009-.868-.014-1.703-2.782.615-3.369-1.372-3.369-1.372-.455-1.185-1.11-1.5-1.11-1.5-.909-.637.069-.624.069-.624 1.004.072 1.532 1.058 1.532 1.058.892 1.56 2.341 1.11 2.91.85.092-.665.35-1.11.636-1.366-2.22-.258-4.555-1.14-4.555-5.075 0-1.122.39-2.039 1.029-2.758-.103-.26-.446-1.303.098-2.716 0 0 .84-.274 2.75 1.054A9.325 9.325 0 0 1 12 6.844a9.29 9.29 0 0 1 2.504.348c1.909-1.328 2.747-1.054 2.747-1.054.546 1.413.203 2.456.1 2.716.64.719 1.027 1.636 1.027 2.758 0 3.945-2.339 4.814-4.566 5.067.359.318.678.946.678 1.907 0 1.376-.012 2.485-.012 2.823 0 .272.18.59.688.49C19.138 20.623 22 16.781 22 12.253 22 6.59 17.523 2 12 2Z" />
                </svg>
              </Button>
              <ModeToggleDropdown trigger={{ class: "w-9 px-0" }} />
            </>
          }
        />
        <main class="flex flex-1 min-h-0">{props.children}</main>
        <AppFooter isDocsRoute={isDocsRoute()} />
      </div>
    </SidebarProvider>
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
