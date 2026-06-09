import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownSmilesPlugin } from 'shadcn-solid-components/components/markdown/plugins/smiles'

const source = `## SMILES

Inline molecule: Ethanol is represented as $smiles{CCO}.

\`\`\`smiles {width: 420, height: 260}
c1ccccc1
\`\`\`
`

const MarkdownSmilesDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[createMarkdownSmilesPlugin()]} />
}

export default MarkdownSmilesDemo
