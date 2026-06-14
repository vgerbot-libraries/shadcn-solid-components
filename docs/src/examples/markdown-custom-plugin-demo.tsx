import { createMarkdownPlugin, Markdown } from 'shadcn-solid-components/components/markdown'

const source = `## Custom Plugin

:::note
This block is transformed by a user plugin.
:::
`

const notePlugin = createMarkdownPlugin({
  name: 'custom-note',
  setup: ({ md }) => {
    md.block.ruler.before(
      'blockquote',
      'custom-note',
      (state: any, startLine: number, endLine: number, silent: boolean) => {
        const start = state.bMarks[startLine] + state.tShift[startLine]
        const max = state.eMarks[startLine]
        const firstLine = state.src.slice(start, max)

        if (!firstLine.startsWith(':::note')) {
          return false
        }

        let nextLine = startLine + 1
        const lines: string[] = []

        while (nextLine < endLine) {
          const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
          const lineEnd = state.eMarks[nextLine]
          const line = state.src.slice(lineStart, lineEnd)

          if (line.trim() === ':::') {
            break
          }

          lines.push(line)
          nextLine += 1
        }

        if (nextLine >= endLine) {
          return false
        }

        if (!silent) {
          const open = state.push('div_open', 'div', 1)
          open.attrSet('class', 'custom-note-block')

          const paragraphOpen = state.push('paragraph_open', 'p', 1)
          paragraphOpen.attrSet('class', 'custom-note-text')

          const inline = state.push('inline', '', 0)
          inline.content = lines.join('\n').trim()
          inline.children = []

          state.push('paragraph_close', 'p', -1)
          state.push('div_close', 'div', -1)
        }

        state.line = nextLine + 1
        return true
      },
    )
  },
  onRendered: ({ shadowRoot }) => {
    // Inject custom styles into shadow DOM
    const styleId = 'custom-note-styles'
    if (!shadowRoot.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .custom-note-block {
          margin: 1rem 0;
          border-radius: 0.375rem;
          border: 1px solid color-mix(in oklch, var(--primary) 30%, transparent);
          background: color-mix(in oklch, var(--primary) 5%, transparent);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .custom-note-text {
          margin: 0;
        }
      `
      shadowRoot.appendChild(style)
    }
  },
})

const MarkdownCustomPluginDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[notePlugin]} />
}

export default MarkdownCustomPluginDemo
