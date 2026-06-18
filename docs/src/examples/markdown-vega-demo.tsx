import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownVegaPlugin } from 'shadcn-solid-components/components/markdown/plugins/vega'

const source = `## Vega Chart

\`\`\`vega
{
  "$schema": "https://vega.github.io/schema/vega/v6.json",
  "width": 420,
  "height": 220,
  "padding": 5,
  "data": [
    {
      "name": "table",
      "values": [
        { "category": "A", "amount": 28 },
        { "category": "B", "amount": 55 },
        { "category": "C", "amount": 43 },
        { "category": "D", "amount": 91 },
        { "category": "E", "amount": 81 },
        { "category": "F", "amount": 53 }
      ]
    }
  ],
  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": { "data": "table", "field": "category" },
      "range": "width",
      "padding": 0.2
    },
    {
      "name": "yscale",
      "domain": { "data": "table", "field": "amount" },
      "nice": true,
      "range": "height"
    }
  ],
  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],
  "marks": [
    {
      "type": "rect",
      "from": { "data": "table" },
      "encode": {
        "enter": {
          "x": { "scale": "xscale", "field": "category" },
          "width": { "scale": "xscale", "band": 1 },
          "y": { "scale": "yscale", "field": "amount" },
          "y2": { "scale": "yscale", "value": 0 },
          "fill": { "value": "#2563eb" }
        },
        "hover": {
          "fill": { "value": "#1d4ed8" }
        }
      }
    }
  ]
}
\`\`\`
`

const MarkdownVegaDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[createMarkdownVegaPlugin()]} />
}

export default MarkdownVegaDemo
