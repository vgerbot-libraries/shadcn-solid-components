declare module 'markdown-it' {
  export interface MarkdownItBlockRuler {
    before: (
      beforeName: string,
      ruleName: string,
      rule: (state: any, startLine: number, endLine: number, silent: boolean) => boolean,
    ) => void
  }

  export interface MarkdownItBlock {
    ruler: MarkdownItBlockRuler
  }

  export interface MarkdownItRenderer {
    rules: Record<string, any>
  }

  export default class MarkdownIt {
    constructor(options?: Record<string, unknown>)
    renderer: MarkdownItRenderer
    block: MarkdownItBlock
    use(plugin: any, options?: any): this
    render(source: string): string
  }
}

declare module 'markdown-it-highlightjs' {
  const markdownItHighlightjs: any
  export default markdownItHighlightjs
}

declare module 'markdown-it-katex' {
  const markdownItKatex: any
  export default markdownItKatex
}

declare module 'markdown-it-mermaid' {
  const markdownItMermaid: any
  export default markdownItMermaid
}

declare module 'markdown-it-smiles' {
  export const MarkdownItSmiles: any
}

declare module 'smiles-drawer' {
  const smilesDrawer: any
  export default smilesDrawer
  export const SmiDrawer: any
}

declare module 'mermaid' {
  const mermaid: {
    initialize: (config?: Record<string, unknown>) => void
    run: (options: { nodes: HTMLElement[] }) => Promise<void>
  }

  export default mermaid
}
