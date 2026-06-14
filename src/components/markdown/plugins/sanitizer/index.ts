import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify'
import { createMarkdownPlugin } from '../../index'

export type MarkdownSanitizerPluginOptions = {
  config?: DOMPurifyConfig
}

const defaultSanitizerConfig: DOMPurifyConfig = {
  USE_PROFILES: {
    html: true,
    mathMl: true,
    svg: true,
    svgFilters: true,
  },
  ADD_TAGS: ['input'],
  ADD_ATTR: [
    'class',
    'id',
    'name',
    'type',
    'value',
    'checked',
    'disabled',
    'start',
    'role',
    'tabindex',
    'aria-hidden',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ],
}

export const createMarkdownSanitizerPlugin = (options?: MarkdownSanitizerPluginOptions) => {
  const sanitizeConfig: DOMPurifyConfig = {
    ...defaultSanitizerConfig,
    ...(options?.config ?? {}),
  }

  return createMarkdownPlugin({
    name: 'sanitizer',
    setup: ({ md }) => {
      ;(md as any).core.ruler.after(
        'linkify',
        'sanitize_inline_and_block_with_dompurify',
        (state: any) => {
          for (const token of state.tokens) {
            if (token.type === 'html_block') {
              token.content = DOMPurify.sanitize(token.content, sanitizeConfig)
              continue
            }

            if (token.type !== 'inline' || !Array.isArray(token.children)) {
              continue
            }

            for (const childToken of token.children) {
              if (childToken.type === 'html_inline') {
                childToken.content = DOMPurify.sanitize(childToken.content, sanitizeConfig)
              }
            }
          }
        },
      )
    },
  })
}
