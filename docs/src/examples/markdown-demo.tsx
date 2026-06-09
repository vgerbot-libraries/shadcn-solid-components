import { Markdown } from 'shadcn-solid-components/components/markdown'

const source = `# Markdown

This component renders **Markdown** content with default shadcn-style typography.

- Lists
- Tables
- Blockquotes

> Plugin support is optional and composable.

| Feature | Status |
| --- | --- |
| Mermaid | Built-in plugin |
| KaTeX | Built-in plugin |
| Draw.io | Planned extension |
`

const MarkdownDemo = () => {
  return <Markdown value={source} class="max-w-3xl" />
}

export default MarkdownDemo
