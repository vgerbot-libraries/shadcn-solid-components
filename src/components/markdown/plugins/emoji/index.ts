import * as markdownItEmoji from 'markdown-it-emoji'
import { createMarkdownPlugin } from '../../index'

export type MarkdownEmojiPluginOptions = Record<string, unknown>

type MarkdownItEmojiModule = {
  full?: unknown
  light?: unknown
  bare?: unknown
}

export const createMarkdownEmojiPlugin = (options?: MarkdownEmojiPluginOptions) => {
  const emojiModule = markdownItEmoji as MarkdownItEmojiModule
  const emojiPlugin = emojiModule.full ?? emojiModule.light ?? emojiModule.bare

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
