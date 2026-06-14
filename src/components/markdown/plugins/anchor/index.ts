import markdownItAnchor from 'markdown-it-anchor'
import { createMarkdownPlugin } from '../../index'

export type MarkdownAnchorPluginOptions = Record<string, unknown>

export const createMarkdownAnchorPlugin = (options?: MarkdownAnchorPluginOptions) => {
  return createMarkdownPlugin({
    name: 'anchor',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(markdownItAnchor as never)
        return
      }

      md.use(markdownItAnchor as never, options)
    },
  })
}
