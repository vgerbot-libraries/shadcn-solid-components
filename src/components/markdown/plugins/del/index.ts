import { createMarkdownPlugin } from '../../index'

export const createMarkdownDelPlugin = () => {
  return createMarkdownPlugin({
    name: 'del',
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-del-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-del-styles', '')
        styleEl.textContent = `
          .markdown-content del {
            text-decoration-color: color-mix(in oklch, var(--destructive) 70%, transparent);
            text-decoration-thickness: 1.5px;
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
