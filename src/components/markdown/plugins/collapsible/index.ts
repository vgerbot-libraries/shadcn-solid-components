import markdownItCollapsible from 'markdown-it-collapsible'
import { createMarkdownPlugin } from '../../index'

export type MarkdownCollapsiblePluginOptions = Record<string, unknown>

export const createMarkdownCollapsiblePlugin = (options?: MarkdownCollapsiblePluginOptions) => {
  return createMarkdownPlugin({
    name: 'collapsible',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(markdownItCollapsible as never)
        return
      }

      md.use(markdownItCollapsible as never, options)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-collapsible-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-collapsible-styles', '')
        styleEl.textContent = `
          .markdown-content details {
            margin: 1rem 0;
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            background: color-mix(in oklch, var(--muted) 30%, transparent);
          }

          .markdown-content summary {
            cursor: pointer;
            font-weight: 600;
          }

          .markdown-content details > :not(summary) {
            margin-top: 0.75rem;
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
