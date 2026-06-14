import markdownItIns from 'markdown-it-ins'
import { createMarkdownPlugin } from '../../index'

export const createMarkdownInsPlugin = () => {
  return createMarkdownPlugin({
    name: 'ins',
    setup: ({ md }) => {
      md.use(markdownItIns as never)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-ins-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-ins-styles', '')
        styleEl.textContent = `
          .markdown-content ins {
            text-decoration-color: color-mix(in oklch, var(--primary) 60%, transparent);
            text-decoration-thickness: 2px;
            text-underline-offset: 2px;
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
