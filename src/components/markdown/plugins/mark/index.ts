import markdownItMark from 'markdown-it-mark'
import { createMarkdownPlugin } from '../../index'

export const createMarkdownMarkPlugin = () => {
  return createMarkdownPlugin({
    name: 'mark',
    setup: ({ md }) => {
      md.use(markdownItMark as never)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-mark-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-mark-styles', '')
        styleEl.textContent = `
          .markdown-content mark {
            border-radius: 0.25rem;
            background: color-mix(in oklch, var(--primary) 18%, var(--background));
            color: inherit;
            padding: 0.05em 0.25em;
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
