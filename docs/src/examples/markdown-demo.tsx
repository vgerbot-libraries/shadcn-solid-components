import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownAnchorPlugin } from 'shadcn-solid-components/components/markdown/plugins/anchor'
import { createMarkdownCollapsiblePlugin } from 'shadcn-solid-components/components/markdown/plugins/collapsible'
import { createMarkdownContainerPlugin } from 'shadcn-solid-components/components/markdown/plugins/container'
import { createMarkdownCopyPlugin } from 'shadcn-solid-components/components/markdown/plugins/copy'
import { createMarkdownDeflistPlugin } from 'shadcn-solid-components/components/markdown/plugins/deflist'
import { createMarkdownDelPlugin } from 'shadcn-solid-components/components/markdown/plugins/del'
import { createMarkdownEmojiPlugin } from 'shadcn-solid-components/components/markdown/plugins/emoji'
import { createMarkdownFootnotePlugin } from 'shadcn-solid-components/components/markdown/plugins/footnote'
import { createMarkdownHighlightPlugin } from 'shadcn-solid-components/components/markdown/plugins/highlight'
import { createMarkdownInsPlugin } from 'shadcn-solid-components/components/markdown/plugins/ins'
import { createMarkdownKatexPlugin } from 'shadcn-solid-components/components/markdown/plugins/katex'
import { createMarkdownLinkAttributesPlugin } from 'shadcn-solid-components/components/markdown/plugins/link-attributes'
import { createMarkdownMarkPlugin } from 'shadcn-solid-components/components/markdown/plugins/mark'
import { createMarkdownMermaidPlugin } from 'shadcn-solid-components/components/markdown/plugins/mermaid'
import { createMarkdownSanitizerPlugin } from 'shadcn-solid-components/components/markdown/plugins/sanitizer'
import { createMarkdownSmilesPlugin } from 'shadcn-solid-components/components/markdown/plugins/smiles'
import { createMarkdownSpoilerPlugin } from 'shadcn-solid-components/components/markdown/plugins/spoiler'
import { createMarkdownTableOfContentsPlugin } from 'shadcn-solid-components/components/markdown/plugins/table-of-contents'
import { createMarkdownTaskListsPlugin } from 'shadcn-solid-components/components/markdown/plugins/task-lists'

const source = `# Quantum Chemistry Markdown Notebook

[[toc]]

## Experiment Agenda

- [x] Build the molecular geometry baseline
- [x] Compare perturbation terms in the Hamiltonian
- [ ] Validate final-state probability amplitudes

## Core Notes

:::info
This page is a single showcase for Markdown core rendering and every built-in plugin.
:::

Term
: Ground-state wavefunction approximation for a molecule.

Use ++inserted corrections++, ~~deprecated assumptions~~, and ==highlighted statements== while reviewing data :microscope: :atom_symbol:.

The hidden interpretation is !!the measurement collapses to one eigenstate!!.

+++ Expand derivation sketch
For a two-level system, approximate time evolution with first-order perturbation and compare to numerical integration.
+++

Reference the [official Mermaid docs](https://mermaid.js.org) and [KaTeX docs](https://katex.org).[^refs]

[^refs]: External links receive extra attributes via the link-attributes plugin.

## Source Code Snippet

\`\`\`ts
import { createSignal } from 'solid-js'

const [energy, setEnergy] = createSignal(0)
setEnergy(prev => prev + 1)
\`\`\`

## Quantum Workflow Diagram

\`\`\`mermaid
flowchart LR
  A[Prepare Molecule] --> B[Construct Hamiltonian]
  B --> C[Apply Basis Set]
  C --> D[Solve Eigenproblem]
  D --> E[Interpret Observables]
\`\`\`

## Equations

Inline equation: $\\Psi(\\mathbf{r}, t) = \\sum_n c_n \\phi_n(\\mathbf{r}) e^{-iE_n t/\\hbar}$

Block equation:

$$
\\hat{H} \\Psi = E \\Psi,
\\quad
\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r})
$$

## Molecular Structure

Inline molecule: Benzene can be represented as $smiles{c1ccccc1}.

\`\`\`smiles {width: 420, height: 240}
CC(=O)Oc1ccccc1C(=O)O
\`\`\`

## Summary Table

| Capability | Status |
| --- | --- |
| Parsing and typography | Built-in |
| Plugin architecture | Composable |
| Quantum + chemistry content | Demonstrated |
`

const MarkdownDemo = () => {
  return (
    <Markdown
      value={source}
      class="max-w-3xl"
      plugins={[
        createMarkdownSanitizerPlugin(),
        createMarkdownAnchorPlugin(),
        createMarkdownTableOfContentsPlugin(),
        createMarkdownTaskListsPlugin(),
        createMarkdownFootnotePlugin(),
        createMarkdownEmojiPlugin(),
        createMarkdownDeflistPlugin(),
        createMarkdownInsPlugin(),
        createMarkdownDelPlugin(),
        createMarkdownMarkPlugin(),
        createMarkdownContainerPlugin({ name: 'info' }),
        createMarkdownLinkAttributesPlugin({
          matcher: (href: string) => href.startsWith('http'),
          attrs: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        }),
        createMarkdownCollapsiblePlugin(),
        createMarkdownSpoilerPlugin(),
        createMarkdownHighlightPlugin(),
        createMarkdownCopyPlugin(),
        createMarkdownMermaidPlugin(),
        createMarkdownKatexPlugin(),
        createMarkdownSmilesPlugin(),
      ]}
    />
  )
}

export default MarkdownDemo
