import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownCopyPlugin } from 'shadcn-solid-components/components/markdown/plugins/copy'
import { createMarkdownHighlightPlugin } from 'shadcn-solid-components/components/markdown/plugins/highlight'

const source = `## Highlight + Copy

\`\`\`ts
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)
setCount(prev => prev + 1)
\`\`\`
`

const MarkdownHighlightCopyDemo = () => {
  return (
    <Markdown
      value={source}
      class="max-w-3xl"
      plugins={[createMarkdownHighlightPlugin(), createMarkdownCopyPlugin()]}
    />
  )
}

export default MarkdownHighlightCopyDemo
