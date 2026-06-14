import markdownItTableOfContents from 'markdown-it-table-of-contents'
import { createMarkdownPlugin } from '../../index'

export type MarkdownTableOfContentsPluginOptions = Record<string, unknown>

export const createMarkdownTableOfContentsPlugin = (
  options?: MarkdownTableOfContentsPluginOptions,
) => {
  return createMarkdownPlugin({
    name: 'table-of-contents',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(markdownItTableOfContents as never)
        return
      }

      md.use(markdownItTableOfContents as never, options)
    },
  })
}
