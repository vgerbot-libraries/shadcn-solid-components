import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownMermaidPlugin } from 'shadcn-solid-components/components/markdown/plugins/mermaid'

const source = `## Mermaid Diagram

\`\`\`mermaid
graph TD
  A[Markdown Input] --> B[markdown-it Parser]
  B --> C[Plugin Pipeline]
  C --> D[HTML Output]
\`\`\`
`

const MarkdownMermaidDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[createMarkdownMermaidPlugin()]} />
}

export default MarkdownMermaidDemo
