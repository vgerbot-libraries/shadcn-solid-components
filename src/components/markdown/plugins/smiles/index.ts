import { MarkdownItSmiles } from 'markdown-it-smiles'
import { default as SmilesDrawer } from 'smiles-drawer'
import { createMarkdownPlugin } from '../../index'
import { getColorMode, watchColorMode } from '../_shared/color-mode'

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

const applySmiles = (
  shadowRoot: ShadowRoot,
  smilesDrawerOptions?: Record<string, unknown>,
  theme?: string,
) => {
  const docQueryDescriptor = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'querySelectorAll',
  )!
  try {
    Object.defineProperty(document, 'querySelectorAll', {
      value: shadowRoot.querySelectorAll.bind(shadowRoot),
      configurable: true,
    })
    SmilesDrawer.SmiDrawer.apply(
      smilesDrawerOptions ?? {},
      {},
      'data-smiles',
      theme ?? getColorMode(),
    )
  } finally {
    Object.defineProperty(document, 'querySelectorAll', docQueryDescriptor)
  }
}

export const createMarkdownSmilesPlugin = (options?: MarkdownSmilesPluginOptions) => {
  return createMarkdownPlugin({
    name: 'smiles',
    setup: ({ md }) => {
      md.use(MarkdownItSmiles as never, {
        ...(options ?? {}),
        renderAtParse: false,
        smilesDrawerOptions: {
          ...(options?.smilesDrawerOptions ?? {}),
          inline: {
            width: 50,
            height: 50,
            ...(options?.smilesDrawerOptions?.inline ?? {}),
          },
        },
        smilesDrawerScript: '',
      })
    },
    onRendered: async ({ shadowRoot }) => {
      applySmiles(shadowRoot, options?.smilesDrawerOptions)

      const stopWatching = watchColorMode(mode => {
        applySmiles(shadowRoot, options?.smilesDrawerOptions, mode)
      })

      return () => {
        stopWatching()
      }
    },
  })
}
