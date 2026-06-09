import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownKatexPlugin } from 'shadcn-solid-components/components/markdown/plugins/katex'

const source = `## KaTeX Math

Inline equation: $\\sum_{n=1}^{\\infty}\\frac{1}{n}$

Block equation:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`

const MarkdownKatexDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[createMarkdownKatexPlugin()]} />
}

export default MarkdownKatexDemo
