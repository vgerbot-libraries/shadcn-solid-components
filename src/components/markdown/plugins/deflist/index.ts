import markdownItDeflist from 'markdown-it-deflist'
import { createMarkdownPlugin } from '../../index'

export const createMarkdownDeflistPlugin = () => {
  return createMarkdownPlugin({
    name: 'deflist',
    setup: ({ md }) => {
      md.use(markdownItDeflist as never)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-deflist-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-deflist-styles', '')
        styleEl.textContent = `
          .markdown-content dl {
            margin: 1rem 0;
          }

          .markdown-content dt {
            margin-top: 0.75rem;
            font-weight: 600;
          }

          .markdown-content dd {
            margin: 0.25rem 0 0 1rem;
            color: var(--muted-foreground);
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
