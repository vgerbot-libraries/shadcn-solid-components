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
  base: 'markdown-content',
  variants: {
    size: {
      sm: 'markdown-content--sm',
      default: 'markdown-content--default',
      lg: 'markdown-content--lg',
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
