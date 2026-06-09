import { MarkdownItSmiles } from 'markdown-it-smiles'
import { default as SmilesDrawer } from 'smiles-drawer'
import { createMarkdownPlugin } from '../../index'

export type MarkdownSmilesPluginOptions = {
  format?: 'svg' | 'img'
  fontUrl?: string
  smilesDrawerScript?: string
  smilesDrawerOptions?: Record<string, unknown>
  errorHandling?: {
    fallbackImage?: string
    onError?: (error: unknown) => void
  }
}

export const createMarkdownSmilesPlugin = (options?: MarkdownSmilesPluginOptions) => {
  return createMarkdownPlugin({
    name: 'smiles',
    setup: ({ md }) => {
      md.use(MarkdownItSmiles as never, {
        ...(options ?? {}),
        renderAtParse: true,
        smilesDrawerOptions: {
          inline: {
            width: 50,
            height: 50,
          },
        },
        smilesDrawerScript: '',
      })
    },
    onRendered: async ({ shadowRoot }) => {
      // Scope SmiDrawer to shadow DOM container only
      const docQueryDescriptor = Object.getOwnPropertyDescriptor(document, 'querySelectorAll');
      try {
        Object.defineProperty(document, 'querySelectorAll', {
          value: shadowRoot.querySelectorAll.bind(shadowRoot)
        })
        SmilesDrawer.SmiDrawer.apply()
      } finally {
        Object.defineProperty(document, 'querySelectorAll', docQueryDescriptor!);
      }
    },
  })
}
