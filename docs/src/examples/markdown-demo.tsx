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
import { createMarkdownVegaPlugin } from 'shadcn-solid-components/components/markdown/plugins/vega'
import { createMarkdownVegaLitePlugin } from 'shadcn-solid-components/components/markdown/plugins/vega-lite'

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

## Data Visualization

\`\`\`vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "width": 420,
  "height": 220,
  "data": {
    "values": [
      { "phase": "Prepare", "value": 28 },
      { "phase": "Model", "value": 64 },
      { "phase": "Solve", "value": 91 },
      { "phase": "Validate", "value": 53 }
    ]
  },
  "mark": { "type": "bar", "tooltip": true },
  "encoding": {
    "x": { "field": "phase", "type": "ordinal", "title": "Phase" },
    "y": { "field": "value", "type": "quantitative", "title": "Score" },
    "color": { "field": "phase", "type": "nominal", "legend": null }
  }
}
\`\`\`

\`\`\`vega
{
  "$schema": "https://vega.github.io/schema/vega/v6.json",
  "width": 420,
  "height": 180,
  "padding": 5,
  "data": [{ "name": "points", "values": [{ "x": 20, "y": 90 }, { "x": 90, "y": 45 }, { "x": 180, "y": 70 }, { "x": 280, "y": 30 }, { "x": 380, "y": 55 }] }],
  "scales": [{ "name": "x", "domain": [0, 420], "range": "width" }, { "name": "y", "domain": [0, 100], "range": "height" }],
  "marks": [{ "type": "symbol", "from": { "data": "points" }, "encode": { "enter": { "x": { "scale": "x", "field": "x" }, "y": { "scale": "y", "field": "y" }, "size": { "value": 180 }, "fill": { "value": "#7c3aed" } } } }]
}
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
        createMarkdownVegaPlugin(),
        createMarkdownVegaLitePlugin(),
        createMarkdownKatexPlugin(),
        createMarkdownSmilesPlugin(),
      ]}
    />
  )
}

export default MarkdownDemo
