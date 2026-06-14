import * as markdownItEmoji from 'markdown-it-emoji'
import { createMarkdownPlugin } from '../../index'

export type MarkdownEmojiPluginOptions = Record<string, unknown>

export const createMarkdownEmojiPlugin = (options?: MarkdownEmojiPluginOptions) => {
  const emojiPlugin = markdownItEmoji.full ?? markdownItEmoji.light ?? markdownItEmoji.bare

  return createMarkdownPlugin({
    name: 'emoji',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(emojiPlugin as never)
        return
      }

      md.use(emojiPlugin as never, options)
    },
  })
}
