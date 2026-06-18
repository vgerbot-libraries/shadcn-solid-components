import darkHighlightStyles from 'highlight.js/styles/atom-one-dark.min.css?inline'
import defaultHighlightStyles from 'highlight.js/styles/atom-one-light.min.css?inline'
import type MarkdownIt from 'markdown-it'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import { createMarkdownPlugin } from '../../index'
import {
  getColorMode,
  type MarkdownColorMode,
  scopeCssForColorMode,
  watchColorMode,
} from '../_shared/color-mode'

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
   * Override highlight.js theme styles for light mode.
   * - `string`: inline CSS text
   * - `object`: optional inline `cssText` and/or external `src` stylesheet
   * Defaults to the built-in `default` theme CSS.
   */
  themeStyles?: MarkdownHighlightThemeStyles
  /**
   * Override highlight.js theme styles for dark mode.
   * - `string`: inline CSS text
   * - `object`: optional inline `cssText` and/or external `src` stylesheet
   * Defaults to the built-in `atom-one-dark` theme CSS.
   * Set to `null` to disable dark mode styles entirely.
   */
  darkThemeStyles?: MarkdownHighlightThemeStyles | null
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

const resolveDarkThemeStyles = (themeStyles?: MarkdownHighlightThemeStyles | null) => {
  if (themeStyles === null) {
    return null
  }

  if (themeStyles === undefined) {
    return { cssText: darkHighlightStyles }
  }

  if (typeof themeStyles === 'string') {
    return { cssText: themeStyles }
  }

  return themeStyles
}

const injectScopedStyles = (shadowRoot: ShadowRoot, cssText: string, mode: MarkdownColorMode) => {
  const attr = `data-markdown-highlight-styles-${mode}`
  if (shadowRoot.querySelector(`style[${attr}]`)) {
    return
  }

  const styleEl = document.createElement('style')
  styleEl.setAttribute(attr, '')
  styleEl.textContent = scopeCssForColorMode(cssText, mode)
  shadowRoot.prepend(styleEl)
}

const injectScopedLink = (
  shadowRoot: ShadowRoot,
  resolved: {
    src?: string
    integrity?: string
    crossOrigin?: HTMLLinkElement['crossOrigin']
    referrerPolicy?: HTMLLinkElement['referrerPolicy']
  },
  mode: MarkdownColorMode,
) => {
  if (!resolved.src) {
    return
  }

  const attr = `data-markdown-highlight-styles-${mode}-src`
  const hasLink = Array.from(shadowRoot.querySelectorAll(`link[${attr}]`)).some(
    link => link.getAttribute('href') === resolved.src,
  )

  if (hasLink) {
    return
  }

  const linkEl = document.createElement('link')
  linkEl.setAttribute(attr, '')
  linkEl.rel = 'stylesheet'
  linkEl.href = resolved.src

  if (resolved.integrity) {
    linkEl.integrity = resolved.integrity
  }

  if (resolved.crossOrigin !== undefined) {
    linkEl.crossOrigin = resolved.crossOrigin
  }

  if (resolved.referrerPolicy) {
    linkEl.referrerPolicy = resolved.referrerPolicy
  }

  shadowRoot.prepend(linkEl)
}

export const createMarkdownHighlightPlugin = (options?: MarkdownHighlightPluginOptions) => {
  const { themeStyles, darkThemeStyles, ...markdownItOptions } = options ?? {}
  const resolvedLightStyles = resolveThemeStyles(themeStyles)
  const resolvedDarkStyles = resolveDarkThemeStyles(darkThemeStyles)

  return createMarkdownPlugin({
    name: 'highlight',
    setup: ({ md }) => {
      ;(md as MarkdownIt).use(markdownItHighlightjs as never, markdownItOptions)
    },
    onRendered: ({ shadowRoot, host }) => {
      if (resolvedLightStyles.cssText !== undefined) {
        injectScopedStyles(shadowRoot, resolvedLightStyles.cssText, 'light')
      }

      if (resolvedLightStyles.src) {
        injectScopedLink(shadowRoot, resolvedLightStyles, 'light')
      }

      if (resolvedDarkStyles?.cssText !== undefined) {
        injectScopedStyles(shadowRoot, resolvedDarkStyles.cssText, 'dark')
      }

      if (resolvedDarkStyles?.src) {
        injectScopedLink(shadowRoot, resolvedDarkStyles, 'dark')
      }

      host.setAttribute('data-kb-theme', getColorMode())

      const stopWatching = watchColorMode(mode => {
        host.setAttribute('data-kb-theme', mode)
      })

      return () => {
        stopWatching()
      }
    },
  })
}
