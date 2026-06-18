import { Markdown } from 'shadcn-solid-components/components/markdown'
import { createMarkdownVegaLitePlugin } from 'shadcn-solid-components/components/markdown/plugins/vega-lite'

const source = `## Vega-Lite Chart

\`\`\`vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "width": 420,
  "height": 240,
  "data": {
    "values": [
      { "month": "Jan", "revenue": 42, "region": "North" },
      { "month": "Feb", "revenue": 58, "region": "North" },
      { "month": "Mar", "revenue": 76, "region": "North" },
      { "month": "Apr", "revenue": 81, "region": "North" },
      { "month": "Jan", "revenue": 36, "region": "South" },
      { "month": "Feb", "revenue": 49, "region": "South" },
      { "month": "Mar", "revenue": 64, "region": "South" },
      { "month": "Apr", "revenue": 72, "region": "South" }
    ]
  },
  "mark": {
    "type": "line",
    "point": true,
    "tooltip": true
  },
  "encoding": {
    "x": { "field": "month", "type": "ordinal", "title": "Month" },
    "y": { "field": "revenue", "type": "quantitative", "title": "Revenue" },
    "color": { "field": "region", "type": "nominal", "title": "Region" }
  }
}
\`\`\`
`

const MarkdownVegaLiteDemo = () => {
  return <Markdown value={source} class="max-w-3xl" plugins={[createMarkdownVegaLitePlugin()]} />
}

export default MarkdownVegaLiteDemo
