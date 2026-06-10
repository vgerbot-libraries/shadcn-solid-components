import katex from 'katex'
import katexStyles from 'katex/dist/katex.min.css?inline'
import { createMarkdownPlugin } from '../../index'

export type MarkdownKatexPluginOptions = {
  throwOnError?: boolean
  errorColor?: string
  strict?: boolean | 'ignore' | 'warn' | 'error'
  trust?: boolean
  macros?: Record<string, string>
  output?: 'html' | 'mathml' | 'htmlAndMathml'
}

const isValidDelim = (state: any, pos: number) => {
  const max = state.posMax
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1
  let canOpen = true
  let canClose = true

  if (prevChar === 0x20 || prevChar === 0x09 || (nextChar >= 0x30 && nextChar <= 0x39)) {
    canClose = false
  }

  if (nextChar === 0x20 || nextChar === 0x09) {
    canOpen = false
  }

  return {
    can_open: canOpen,
    can_close: canClose,
  }
}

const mathInline = (state: any, silent: boolean) => {
  if (state.src[state.pos] !== '$') {
    return false
  }

  const openDelim = isValidDelim(state, state.pos)
  if (!openDelim.can_open) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos += 1
    return true
  }

  const start = state.pos + 1
  let match = start

  while ((match = state.src.indexOf('$', match)) !== -1) {
    let pos = match - 1
    while (state.src[pos] === '\\') {
      pos -= 1
    }

    if ((match - pos) % 2 === 1) {
      break
    }

    match += 1
  }

  if (match === -1) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos = start
    return true
  }

  if (match - start === 0) {
    if (!silent) {
      state.pending += '$$'
    }
    state.pos = start + 1
    return true
  }

  const closeDelim = isValidDelim(state, match)
  if (!closeDelim.can_close) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos = start
    return true
  }

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }

  state.pos = match + 1
  return true
}

const mathBlock = (state: any, start: number, end: number, silent: boolean) => {
  let pos = state.bMarks[start] + state.tShift[start]
  const max = state.eMarks[start]

  if (pos + 2 > max || state.src.slice(pos, pos + 2) !== '$$') {
    return false
  }

  pos += 2
  let firstLine = state.src.slice(pos, max)

  if (silent) {
    return true
  }

  let found = false
  let lastLine = ''

  if (firstLine.trim().slice(-2) === '$$') {
    firstLine = firstLine.trim().slice(0, -2)
    found = true
  }

  let next = start
  for (; !found; ) {
    next += 1

    if (next >= end) {
      break
    }

    pos = state.bMarks[next] + state.tShift[next]
    const nextMax = state.eMarks[next]

    if (pos < nextMax && state.tShift[next] < state.blkIndent) {
      break
    }

    if (state.src.slice(pos, nextMax).trim().slice(-2) === '$$') {
      const lastPos = state.src.slice(0, nextMax).lastIndexOf('$$')
      lastLine = state.src.slice(pos, lastPos)
      found = true
    }
  }

  state.line = next + 1

  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.content = `${firstLine && firstLine.trim() ? `${firstLine}\n` : ''}${state.getLines(
    start + 1,
    next,
    state.tShift[start],
    true,
  )}${lastLine && lastLine.trim() ? lastLine : ''}`
  token.map = [start, state.line]
  token.markup = '$$'
  return true
}

export const createMarkdownKatexPlugin = (options?: MarkdownKatexPluginOptions) => {
  return createMarkdownPlugin({
    name: 'katex',
    setup: ({ md }) => {
      const markdownIt = md as any

      markdownIt.inline.ruler.after('escape', 'math_inline', mathInline)
      markdownIt.block.ruler.after('blockquote', 'math_block', mathBlock, {
        alt: ['paragraph', 'reference', 'blockquote', 'list'],
      })
      md.renderer.rules.math_inline = (tokens: any[], idx: number) => {
        return katex.renderToString(tokens[idx].content, {
          ...options,
          displayMode: false,
        })
      }
      md.renderer.rules.math_block = (tokens: any[], idx: number) => {
        return `<p>${katex.renderToString(tokens[idx].content, {
          ...options,
          displayMode: true,
        })}</p>\n`
      }
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-katex-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-katex-styles', '')
        styleEl.textContent = katexStyles
        shadowRoot.prepend(styleEl)
      }

      const output = options?.output ?? 'html'

      for (const katexElement of shadowRoot.querySelectorAll('.katex')) {
        if (output === 'html') {
          katexElement.querySelectorAll('.katex-mathml').forEach(element => {
            element.remove()
          })
        }

        if (output === 'mathml') {
          katexElement.querySelectorAll('.katex-html').forEach(element => {
            element.remove()
          })
        }
      }
    },
  })
}
