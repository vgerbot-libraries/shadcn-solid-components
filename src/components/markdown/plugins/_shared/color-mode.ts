export type MarkdownColorMode = 'light' | 'dark'

const KB_THEME_ATTR = 'data-kb-theme'

export const getColorMode = (): MarkdownColorMode => {
  const value = document.documentElement.getAttribute(KB_THEME_ATTR)
  return value === 'dark' ? 'dark' : 'light'
}

export const watchColorMode = (callback: (mode: MarkdownColorMode) => void): (() => void) => {
  const observer = new MutationObserver(() => {
    callback(getColorMode())
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [KB_THEME_ATTR],
  })

  return () => observer.disconnect()
}

export const scopeCssForColorMode = (css: string, mode: MarkdownColorMode): string => {
  const hostSelector = `:host([${KB_THEME_ATTR}="${mode}"])`

  return css
    .split(/(?<=})/)
    .map(rule => {
      const trimmed = rule.trim()
      if (!trimmed) {
        return ''
      }

      const braceIndex = trimmed.indexOf('{')
      if (braceIndex === -1) {
        return ''
      }

      const selectors = trimmed.slice(0, braceIndex).trim()
      const body = trimmed.slice(braceIndex)

      const scopedSelectors = selectors
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => `${hostSelector} ${s}`)
        .join(', ')

      return `${scopedSelectors} ${body}`
    })
    .filter(Boolean)
    .join('\n')
}
