import markdownItFootnote from 'markdown-it-footnote'
import { createMarkdownPlugin } from '../../index'

export const createMarkdownFootnotePlugin = () => {
  return createMarkdownPlugin({
    name: 'footnote',
    setup: ({ md }) => {
      md.use(markdownItFootnote as never)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-footnote-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-footnote-styles', '')
        styleEl.textContent = `
          .markdown-content .footnotes {
            margin-top: 1.5rem;
            border-top: 1px solid var(--border);
            padding-top: 1rem;
            color: var(--muted-foreground);
            font-size: 0.875rem;
          }

          .markdown-content .footnote-ref {
            vertical-align: super;
            font-size: 0.75em;
          }

          .markdown-content .footnote-backref {
            margin-left: 0.25rem;
            text-decoration: none;
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
