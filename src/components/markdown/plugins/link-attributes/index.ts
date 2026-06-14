import markdownItLinkAttributes from 'markdown-it-link-attributes'
import { createMarkdownPlugin } from '../../index'

export type MarkdownLinkAttributesPluginOptions = Record<string, unknown>

export const createMarkdownLinkAttributesPlugin = (
  options?: MarkdownLinkAttributesPluginOptions,
) => {
  return createMarkdownPlugin({
    name: 'link-attributes',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(markdownItLinkAttributes as never)
        return
      }

      md.use(markdownItLinkAttributes as never, options)
    },
  })
}
