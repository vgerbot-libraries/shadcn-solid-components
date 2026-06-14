import * as markdownItMermaidModule from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import { createMarkdownPlugin } from '../../index'
import mermaidStyles from './index.css?inline'

const markdownItMermaid =
  (markdownItMermaidModule as { default?: unknown }).default ?? markdownItMermaidModule

let initializedMermaidOptionsKey = ''

type MermaidRenderResult = {
  svg: string
  bindFunctions?: (element: Element) => void
}

type MermaidRuntime = typeof mermaid & {
  render: (id: string, text: string) => Promise<MermaidRenderResult>
}

const mermaidRuntime = mermaid as MermaidRuntime

const ensureStyles = (shadowRoot: ShadowRoot) => {
  if (shadowRoot.querySelector('style[data-markdown-mermaid-styles]')) {
    return
  }

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-markdown-mermaid-styles', '')
  styleEl.textContent = mermaidStyles
  shadowRoot.prepend(styleEl)
}

const normalizeSource = (node: HTMLElement) => {
  const rawSource = node.getAttribute('data-mermaid') ?? node.textContent ?? ''
  const source = rawSource.trim()

  if (!source) {
    return ''
  }

  node.setAttribute('data-mermaid', source)
  node.removeAttribute('data-processed')
  node.textContent = source
  node.classList.add('mermaid')

  return source
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const extractErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim()
  }

  try {
    const parsed = JSON.stringify(error)
    if (parsed) {
      return parsed
    }
  } catch {
    return 'Unknown Mermaid render error.'
  }

  return 'Unknown Mermaid render error.'
}

const renderError = (node: HTMLElement, source: string, message: string) => {
  node.innerHTML = `
    <div class="markdown-mermaid-error" data-mermaid-error="true">
      <div class="markdown-mermaid-error-title">Mermaid render failed</div>
      <pre class="markdown-mermaid-error-message">${escapeHtml(message)}</pre>
      <details>
        <summary>Diagram source</summary>
        <pre class="markdown-mermaid-error-source">${escapeHtml(source)}</pre>
      </details>
    </div>
  `
}

const stableStringify = (value: unknown, seen = new WeakSet<object>()): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item, seen)).join(',')}]`
  }

  if (seen.has(value)) {
    return '"[Circular]"'
  }
  seen.add(value)

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item, seen)}`)
    .join(',')}}`
}

const createOptionsKey = (options: Record<string, unknown>) => {
  try {
    return stableStringify(options)
  } catch {
    return '[unserializable-mermaid-options]'
  }
}

export type MarkdownMermaidPluginOptions = {
  mermaidOptions?: Record<string, unknown>
}

export const createMarkdownMermaidPlugin = (options?: MarkdownMermaidPluginOptions) => {
  const mermaidOptions = options?.mermaidOptions ?? {}

  return createMarkdownPlugin({
    name: 'mermaid',
    setup: ({ md }) => {
      if (typeof markdownItMermaid === 'function') {
        md.use(markdownItMermaid as never, mermaidOptions)
      }
    },
    onRendered: async ({ container, shadowRoot }) => {
      ensureStyles(shadowRoot)

      const mermaidNodes = Array.from(container.querySelectorAll<HTMLElement>('.mermaid'))
      if (mermaidNodes.length === 0) {
        return
      }

      const runtimeMermaidOptions = {
        startOnLoad: false,
        ...mermaidOptions,
      }
      const optionsKey = createOptionsKey(runtimeMermaidOptions)

      if (optionsKey !== initializedMermaidOptionsKey) {
        mermaid.initialize(runtimeMermaidOptions)
        initializedMermaidOptionsKey = optionsKey
      }

      const renderIdPrefix = `markdown-mermaid-${Date.now()}`
      for (const [index, node] of mermaidNodes.entries()) {
        const source = normalizeSource(node)
        if (!source) {
          continue
        }

        const renderId = `${renderIdPrefix}-${index}`
        try {
          const rendered = await mermaidRuntime.render(renderId, source)

          node.innerHTML = rendered.svg
          node.setAttribute('data-processed', 'true')
          rendered.bindFunctions?.(node)
        } catch (error) {
          renderError(node, source, extractErrorMessage(error))
        }
      }
    },
  })
}
