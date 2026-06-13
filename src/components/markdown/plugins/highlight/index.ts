import defaultHighlightStyles from 'highlight.js/styles/default.min.css?inline'
import type MarkdownIt from 'markdown-it'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import { createMarkdownPlugin } from '../../index'

export type MarkdownHighlightThemeStyles =
  | string
  | {
      cssText?: string
      src?: string
      integrity?: string
      crossOrigin?: HTMLLinkElement['crossOrigin']
      referrerPolicy?: HTMLLinkElement['referrerPolicy']
    }

export type MarkdownHighlightPluginOptions = {
  auto?: boolean
  code?: boolean
  inline?: boolean
  ignoreIllegals?: boolean
  register?: Record<string, unknown>
  /**
   * Override highlight.js theme styles.
   * - `string`: inline CSS text
   * - `object`: optional inline `cssText` and/or external `src` stylesheet
   * Defaults to the built-in `default` theme CSS.
   */
  themeStyles?: MarkdownHighlightThemeStyles
}

const resolveThemeStyles = (themeStyles?: MarkdownHighlightThemeStyles) => {
  if (themeStyles === undefined) {
    return { cssText: defaultHighlightStyles }
  }

  if (typeof themeStyles === 'string') {
    return { cssText: themeStyles }
  }

  return themeStyles
}

export const createMarkdownHighlightPlugin = (options?: MarkdownHighlightPluginOptions) => {
  const { themeStyles, ...markdownItOptions } = options ?? {}
  const resolvedThemeStyles = resolveThemeStyles(themeStyles)

  return createMarkdownPlugin({
    name: 'highlight',
    setup: ({ md }) => {
      ;(md as MarkdownIt).use(markdownItHighlightjs as never, markdownItOptions)
    },
    onRendered: ({ shadowRoot }) => {
      if (
        resolvedThemeStyles.cssText !== undefined &&
        !shadowRoot.querySelector('style[data-markdown-highlight-styles]')
      ) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-highlight-styles', '')
        styleEl.textContent = resolvedThemeStyles.cssText
        shadowRoot.prepend(styleEl)
      }

      if (resolvedThemeStyles.src) {
        const hasLink = Array.from(
          shadowRoot.querySelectorAll('link[data-markdown-highlight-styles-src]'),
        ).some(link => link.getAttribute('href') === resolvedThemeStyles.src)

        if (!hasLink) {
          const linkEl = document.createElement('link')
          linkEl.setAttribute('data-markdown-highlight-styles-src', '')
          linkEl.rel = 'stylesheet'
          linkEl.href = resolvedThemeStyles.src

          if (resolvedThemeStyles.integrity) {
            linkEl.integrity = resolvedThemeStyles.integrity
          }

          if (resolvedThemeStyles.crossOrigin !== undefined) {
            linkEl.crossOrigin = resolvedThemeStyles.crossOrigin
          }

          if (resolvedThemeStyles.referrerPolicy) {
            linkEl.referrerPolicy = resolvedThemeStyles.referrerPolicy
          }

          shadowRoot.prepend(linkEl)
        }
      }
    },
  })
}
