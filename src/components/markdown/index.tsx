import type { VariantProps } from 'cva'
import MarkdownIt from 'markdown-it'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  mergeProps,
  onCleanup,
  splitProps,
} from 'solid-js'
import markdownStyles from './index.css?inline'

export type MarkdownPluginCleanup = () => void

export type MarkdownPluginRenderContext = {
  /** The shadow host element (the outer div) */
  host: HTMLElement
  /** The shadow root container where HTML is rendered */
  container: HTMLElement
  shadowRoot: ShadowRoot
  source: string
  html: string
}

export type MarkdownPluginSetupContext = {
  md: MarkdownIt
}

export type MarkdownPlugin = {
  name: string
  setup?: (context: MarkdownPluginSetupContext) => void
  onRendered?: (
    context: MarkdownPluginRenderContext,
  ) => void | MarkdownPluginCleanup | Promise<void | MarkdownPluginCleanup>
}

export type MarkdownPluginFactory = (plugin: MarkdownPlugin) => MarkdownPlugin

export const createMarkdownPlugin: MarkdownPluginFactory = plugin => plugin

export const markdownVariants = cva({
  base: [
    'text-foreground',
    'leading-7',
    '[&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline',
    '[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic',
    '[&_code]:bg-muted [&_code]:relative [&_code]:rounded [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm',
    '[&_h1]:mt-2 [&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight',
    '[&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-1 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight',
    '[&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight',
    '[&_h4]:mt-8 [&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight',
    '[&_li]:mt-2',
    '[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal',
    '[&_p]:leading-7 [&_p:not(:first-child)]:mt-6',
    '[&_pre]:bg-muted [&_pre]:border-border [&_pre]:text-foreground [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:p-4',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
    '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-y-auto',
    '[&_tbody_tr:last-child]:border-0',
    '[&_td]:border-border [&_td]:border [&_td]:px-4 [&_td]:py-2 [&_td]:text-left [&_td]:align-top',
    '[&_th]:border-border [&_th]:border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold',
    '[&_tr]:m-0 [&_tr]:border-t [&_tr]:p-0 even:[&_tr]:bg-muted/50',
    '[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc',
  ],
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export type MarkdownProps = Omit<ComponentProps<'div'>, 'children'> &
  VariantProps<typeof markdownVariants> & {
    value?: string
    children?: string
    plugins?: MarkdownPlugin[]
    markdownItOptions?: Record<string, unknown>
    allowHtml?: boolean
    sanitize?: (html: string) => string
  }

export const createMarkdownRenderer = (options: {
  source: string
  plugins?: MarkdownPlugin[]
  markdownItOptions?: Record<string, unknown>
  allowHtml?: boolean
  sanitize?: (html: string) => string
}) => {
  const md = new MarkdownIt({
    html: options.allowHtml ?? false,
    linkify: true,
    typographer: true,
    ...(options.markdownItOptions ?? {}),
  })

  for (const plugin of options.plugins ?? []) {
    plugin.setup?.({ md })
  }

  const rendered = md.render(options.source)
  return options.sanitize ? options.sanitize(rendered) : rendered
}

export const Markdown = (props: MarkdownProps) => {
  const merge = mergeProps(
    {
      size: 'default',
      plugins: [],
      allowHtml: false,
    } as MarkdownProps,
    props,
  )

  const [local, rest] = splitProps(merge, [
    'class',
    'size',
    'value',
    'children',
    'plugins',
    'markdownItOptions',
    'allowHtml',
    'sanitize',
  ])

  const componentClass = useComponentClass(ComponentName.Markdown, merge)
  const source = () => local.value ?? local.children ?? ''
  const plugins = () => (local.plugins ?? []) as MarkdownPlugin[]

  const renderer = createMemo(() => {
    const md = new MarkdownIt({
      html: local.allowHtml ?? false,
      linkify: true,
      typographer: true,
      ...(local.markdownItOptions ?? {}),
    })

    for (const plugin of plugins()) {
      plugin.setup?.({ md })
    }

    return md
  })

  const html = createMemo(() => {
    const rendered = renderer().render(source())
    return local.sanitize ? local.sanitize(rendered) : rendered
  })

  let hostRef: HTMLDivElement | undefined
  let shadowRoot: ShadowRoot | undefined
  let contentContainer: HTMLDivElement | undefined
  let runToken = 0
  let cleanupFns: MarkdownPluginCleanup[] = []

  const disposePluginCleanups = () => {
    for (const cleanup of cleanupFns.splice(0)) {
      cleanup()
    }
  }

  // Initialize shadow DOM once
  const initShadowDOM = (host: HTMLDivElement) => {
    if (shadowRoot) {
      return
    }

    hostRef = host
    shadowRoot = host.attachShadow({ mode: 'open' })

    // Create style element with component styles
    const styleEl = document.createElement('style')
    styleEl.textContent = markdownStyles
    shadowRoot.appendChild(styleEl)

    // Create content container
    contentContainer = document.createElement('div')
    contentContainer.className = cx(
      markdownVariants({ size: local.size }),
      'rounded-component',
      componentClass,
      local.class,
    )
    contentContainer.setAttribute('data-slot', 'markdown-content')
    shadowRoot.appendChild(contentContainer)

    // Inherit CSS variables from host - CSS custom properties cascade into shadow DOM
    const hostStyle = document.createElement('style')
    hostStyle.textContent = `
      :host {
        display: block;
        /* Inherit CSS variables from host */
        color: inherit;
      }
    `
    shadowRoot.insertBefore(hostStyle, styleEl)
  }

  // Effect to update content when HTML changes
  createEffect(() => {
    const renderedHtml = html()
    const currentPlugins = plugins()
    const currentSource = source()
    const currentToken = ++runToken

    // Ensure shadow DOM is initialized
    if (!shadowRoot || !contentContainer || !hostRef) {
      return
    }

    // Update content HTML
    contentContainer.innerHTML = renderedHtml

    queueMicrotask(async () => {
      if (currentToken !== runToken) {
        return
      }

      disposePluginCleanups()

      const nextCleanups: MarkdownPluginCleanup[] = []
      for (const plugin of currentPlugins) {
        if (!plugin.onRendered) {
          continue
        }

        const cleanup = await plugin.onRendered({
          host: hostRef!,
          container: contentContainer!,
          shadowRoot: shadowRoot!,
          source: currentSource,
          html: renderedHtml,
        })

        if (typeof cleanup === 'function') {
          nextCleanups.push(cleanup)
        }
      }

      if (currentToken === runToken) {
        cleanupFns = nextCleanups
      } else {
        for (const cleanup of nextCleanups) {
          cleanup()
        }
      }
    })
  })

  // Effect to update classes when props change
  createEffect(() => {
    if (contentContainer) {
      contentContainer.className = cx(
        markdownVariants({ size: local.size }),
        'rounded-component',
        componentClass,
        local.class,
      )
    }
  })

  onCleanup(() => {
    runToken += 1
    disposePluginCleanups()
  })

  return (
    <div
      ref={el => {
        if (el && !shadowRoot) {
          initShadowDOM(el)
        }
      }}
      data-slot="markdown"
      {...rest}
    />
  )
}
