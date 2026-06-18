import embed from 'vega-embed'
import { createMarkdownPlugin } from '../../index'
import {
  createMarkdownDiagramViewer,
  defaultMarkdownDiagramViewerLabels,
  ensureMarkdownDiagramViewerStyles,
  escapeHtml,
  extractErrorMessage,
  type MarkdownDiagramViewerLabels,
  type MarkdownDiagramViewerOptions,
  renderMarkdownDiagramError,
} from './viewer'

type VegaEmbedResult = {
  view?: {
    toImageURL?: (type: 'svg' | 'png', scaleFactor?: number) => Promise<string>
    finalize?: () => void
  }
}

type VegaEmbed = (
  element: HTMLElement,
  spec: Record<string, unknown>,
  options?: Record<string, unknown>,
) => Promise<VegaEmbedResult>

export type MarkdownVegaBasePluginOptions = {
  vegaEmbedOptions?: Record<string, unknown>
  view?: MarkdownDiagramViewerOptions
  labels?: Partial<MarkdownDiagramViewerLabels>
  exportFileName?: (index: number) => string
}

type VegaPluginConfig = {
  name: string
  fenceName: string
  dataAttribute: string
  codeLanguage: string
  defaultExportPrefix: string
  errorTitle: string
  defaultImageTabLabel: string
}

const vegaEmbed = embed as unknown as VegaEmbed

const normalizeInfo = (info: string) => info.trim().split(/\s+/, 1)[0]

const createPlaceholder = (dataAttribute: string, source: string) =>
  `<div class="markdown-diagram" ${dataAttribute}="${escapeHtml(source)}"></div>`

const parseSpec = (source: string) => JSON.parse(source) as Record<string, unknown>

const dataUrlToBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl)
  return await response.blob()
}

const triggerDownload = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(href)
}

const copyDataUrlImage = async (dataUrl: string) => {
  if (!navigator.clipboard || !('ClipboardItem' in window) || !navigator.clipboard.write) {
    return
  }

  const blob = await dataUrlToBlob(dataUrl)
  const clipboardItem = new ClipboardItem({
    [blob.type]: blob,
  })
  await navigator.clipboard.write([clipboardItem])
}

export const createMarkdownVegaBasePlugin = (
  config: VegaPluginConfig,
  options?: MarkdownVegaBasePluginOptions,
) => {
  const labels: MarkdownDiagramViewerLabels = {
    ...defaultMarkdownDiagramViewerLabels,
    imageTab: config.defaultImageTabLabel,
    ...(options?.labels ?? {}),
  }

  return createMarkdownPlugin({
    name: config.name,
    setup: ({ md }) => {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (
        tokens: any[],
        idx: number,
        markdownOptions: any,
        env: any,
        self: any,
      ) => {
        const token = tokens[idx]
        if (normalizeInfo(token.info ?? '') !== config.fenceName) {
          return defaultFence
            ? defaultFence(tokens, idx, markdownOptions, env, self)
            : self.renderToken(tokens, idx, markdownOptions)
        }

        return createPlaceholder(config.dataAttribute, token.content ?? '')
      }
    },
    onRendered: async ({ container, shadowRoot }) => {
      ensureMarkdownDiagramViewerStyles(shadowRoot)

      const nodes = Array.from(container.querySelectorAll<HTMLElement>(`[${config.dataAttribute}]`))
      if (nodes.length === 0) {
        return
      }

      const cleanupFns: Array<() => void> = []

      for (const [index, node] of nodes.entries()) {
        const source = node.getAttribute(config.dataAttribute)?.trim() ?? ''
        if (!source) {
          continue
        }

        try {
          const spec = parseSpec(source)
          const renderContainer = document.createElement('div')
          renderContainer.className = 'markdown-diagram__vega-renderer'
          const result = await vegaEmbed(renderContainer, spec, {
            actions: false,
            renderer: 'svg',
            ...(options?.vegaEmbedOptions ?? {}),
          })

          const exportBaseName =
            options?.exportFileName?.(index) ?? `${config.defaultExportPrefix}-${index + 1}`
          const renderImageUrl = (type: 'svg' | 'png') => result.view?.toImageURL?.(type, 2)
          const copyImage = async () => {
            const dataUrl = await renderImageUrl('png')
            if (dataUrl) {
              await copyDataUrlImage(dataUrl)
            }
          }
          const downloadImage = async () => {
            const dataUrl = await renderImageUrl('svg')
            if (!dataUrl) {
              return
            }

            triggerDownload(await dataUrlToBlob(dataUrl), `${exportBaseName}.svg`)
          }
          const modalImageContent = () => renderContainer.cloneNode(true)

          node.innerHTML = ''
          const viewer = createMarkdownDiagramViewer({
            shadowRoot,
            source,
            imageContent: renderContainer,
            codeLanguage: config.codeLanguage,
            labels,
            view: options?.view,
            exportFileName: exportBaseName,
            copyImage,
            downloadImage,
            modalImageContent,
          })
          node.append(viewer.element)

          cleanupFns.push(() => {
            viewer.cleanup()
            result.view?.finalize?.()
          })
        } catch (error) {
          renderMarkdownDiagramError(node, config.errorTitle, source, extractErrorMessage(error))
        }
      }

      return () => {
        for (const cleanup of cleanupFns) {
          cleanup()
        }
      }
    },
  })
}
