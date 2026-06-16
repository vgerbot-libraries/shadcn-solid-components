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

declare module 'markdown-it-anchor' {
  const markdownItAnchor: any
  export default markdownItAnchor
}

declare module 'markdown-it-table-of-contents' {
  const markdownItTableOfContents: any
  export default markdownItTableOfContents
}

declare module 'markdown-it-footnote' {
  const markdownItFootnote: any
  export default markdownItFootnote
}

declare module 'markdown-it-emoji' {
  export const full: any
  export const light: any
  export const bare: any
}

declare module 'markdown-it-task-lists' {
  const markdownItTaskLists: any
  export default markdownItTaskLists
}

declare module 'markdown-it-deflist' {
  const markdownItDeflist: any
  export default markdownItDeflist
}

declare module 'markdown-it-ins' {
  const markdownItIns: any
  export default markdownItIns
}

declare module 'markdown-it-del' {
  const markdownItDel: any
  export default markdownItDel
}

declare module 'markdown-it-mark' {
  const markdownItMark: any
  export default markdownItMark
}

declare module 'markdown-it-container' {
  const markdownItContainer: any
  export default markdownItContainer
}

declare module 'markdown-it-link-attributes' {
  const markdownItLinkAttributes: any
  export default markdownItLinkAttributes
}

declare module 'markdown-it-collapsible' {
  const markdownItCollapsible: any
  export default markdownItCollapsible
}

declare module 'markdown-it-sanitizer' {
  const markdownItSanitizer: any
  export default markdownItSanitizer
}

declare module '@traptitech/markdown-it-spoiler' {
  const markdownItSpoiler: any
  export default markdownItSpoiler
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

declare module 'svg-pan-zoom' {
  const svgPanZoom: any
  export default svgPanZoom
}
