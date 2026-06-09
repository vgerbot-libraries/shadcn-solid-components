import type MarkdownIt from 'markdown-it'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import { createMarkdownPlugin } from '../../index'

export type MarkdownHighlightPluginOptions = {
  auto?: boolean
  code?: boolean
  inline?: boolean
  ignoreIllegals?: boolean
  register?: Record<string, unknown>
}

export const createMarkdownHighlightPlugin = (options?: MarkdownHighlightPluginOptions) => {
  return createMarkdownPlugin({
    name: 'highlight',
    setup: ({ md }) => {
      ;(md as MarkdownIt).use(markdownItHighlightjs as never, options ?? {})
    },
  })
}
