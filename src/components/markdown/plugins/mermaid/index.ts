import { createMarkdownPlugin } from '../../index'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export type MarkdownMermaidPluginOptions = {
  strategy?: 'render' | 'fallback'
  mermaidConfig?: Record<string, unknown>
}

export const createMarkdownMermaidPlugin = (options?: MarkdownMermaidPluginOptions) => {
  const strategy = options?.strategy ?? 'render'

  return createMarkdownPlugin({
    name: 'mermaid',
    setup: ({ md }) => {
      const defaultFence = md.renderer.rules.fence

      md.renderer.rules.fence = (tokens: any[], index: number, opts: any, env: any, self: any) => {
        const token = tokens[index]
        const info = token.info.trim().split(/\s+/)[0]

        if (info !== 'mermaid') {
          if (defaultFence) {
            return defaultFence(tokens, index, opts, env, self)
          }

          return self.renderToken(tokens, index, opts)
        }

        if (strategy === 'fallback') {
          return `<div data-slot="markdown-mermaid-fallback" class="shadcn-markdown-mermaid-fallback"><pre><code>${escapeHtml(token.content)}</code></pre></div>`
        }

        return `<div data-slot="markdown-mermaid" class="shadcn-markdown-mermaid" data-mermaid="${escapeHtml(token.content)}"></div>`
      }
    },
    onRendered: async ({ container }) => {
      if (strategy === 'fallback') {
        return
      }

      const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-mermaid]')).filter(
        node => {
          if (node.dataset.mermaidRendered === 'true') {
            return false
          }

          const source = node.getAttribute('data-mermaid')
          return Boolean(source?.trim())
        },
      )

      if (targets.length === 0) {
        return
      }

      const mermaidModule = await import('mermaid')
      const mermaid = (mermaidModule.default ?? mermaidModule) as {
        initialize: (config?: Record<string, unknown>) => void
        run: (options: { nodes: HTMLElement[] }) => Promise<void>
      }

      for (const target of targets) {
        const source = target.getAttribute('data-mermaid')

        if (!source) {
          continue
        }

        target.classList.add('mermaid')
        target.textContent = source
      }

      mermaid.initialize({ startOnLoad: false, ...(options?.mermaidConfig ?? {}) })

      try {
        await mermaid.run({ nodes: targets })
      } catch {
        for (const target of targets) {
          const source = target.getAttribute('data-mermaid')

          target.classList.remove('mermaid')
          target.dataset.slot = 'markdown-mermaid-fallback'
          target.classList.add('shadcn-markdown-mermaid-fallback')
          target.innerHTML = `<pre><code>${escapeHtml(source ?? '')}</code></pre>`
        }

        return
      }

      for (const target of targets) {
        target.dataset.mermaidRendered = 'true'
      }
    },
  })
}
