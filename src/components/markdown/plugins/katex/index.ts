import katexStyles from 'katex/dist/katex.min.css?inline'
import markdownItKatex from 'markdown-it-katex'
import { createMarkdownPlugin } from '../../index'

export type MarkdownKatexPluginOptions = {
  throwOnError?: boolean
  errorColor?: string
  strict?: boolean | 'ignore' | 'warn' | 'error'
  trust?: boolean
  macros?: Record<string, string>
  output?: 'html' | 'mathml' | 'htmlAndMathml'
}

export const createMarkdownKatexPlugin = (options?: MarkdownKatexPluginOptions) => {
  return createMarkdownPlugin({
    name: 'katex',
    setup: ({ md }) => {
      md.use(markdownItKatex as never, {
        ...options,
      })
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-katex-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-katex-styles', '')
        styleEl.textContent = katexStyles
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
