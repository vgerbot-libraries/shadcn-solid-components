import * as markdownItMermaidModule from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import { createMarkdownPlugin } from '../../index'
import {
  createMarkdownDiagramViewer,
  defaultMarkdownDiagramViewerLabels,
  ensureMarkdownDiagramViewerStyles,
  extractErrorMessage,
  type MarkdownDiagramViewerLabels,
  type MarkdownDiagramViewerOptions,
  normalizeSvgLayout,
  renderMarkdownDiagramError,
} from '../_shared/viewer'

const markdownItMermaid =
  (markdownItMermaidModule as { default?: unknown }).default ?? markdownItMermaidModule

let initializedMermaidOptionsKey = ''

type MermaidRenderResult = {
  svg: string
  bindFunctions?: (element: Element) => void
}

type MermaidRuntime = typeof mermaid & {
  render: (id: string, text: string) => Promise<MermaidRenderResult>
}

export type MarkdownMermaidPluginOptions = {
  mermaidOptions?: Record<string, unknown>
  view?: MarkdownDiagramViewerOptions
  labels?: Partial<MarkdownDiagramViewerLabels>
  exportFileName?: (index: number) => string
}

const mermaidRuntime = mermaid as MermaidRuntime

const normalizeSource = (node: HTMLElement) => {
  const rawSource = node.getAttribute('data-mermaid') ?? node.textContent ?? ''
  const source = rawSource.trim()

  if (!source) {
    return ''
  }

  node.setAttribute('data-mermaid', source)
  node.removeAttribute('data-processed')
  node.textContent = source
  node.classList.add('mermaid')

  return source
}

const stableStringify = (value: unknown, seen = new WeakSet<object>()): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item, seen)).join(',')}]`
  }

  if (seen.has(value)) {
    return '"[Circular]"'
  }
  seen.add(value)

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item, seen)}`).join(',')}}`
}

const createOptionsKey = (options: Record<string, unknown>) => {
  try {
    return stableStringify(options)
  } catch {
    return '[unserializable-mermaid-options]'
  }
}

const getSvgSize = (svgElement: SVGSVGElement) => {
  const viewBox = svgElement.viewBox.baseVal

  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height }
  }

  const widthAttr = Number.parseFloat(svgElement.getAttribute('width') ?? '')
  const heightAttr = Number.parseFloat(svgElement.getAttribute('height') ?? '')

  if (
    Number.isFinite(widthAttr) &&
    Number.isFinite(heightAttr) &&
    widthAttr > 0 &&
    heightAttr > 0
  ) {
    return { width: widthAttr, height: heightAttr }
  }

  const rect = svgElement.getBoundingClientRect()
  return {
    width: Math.max(rect.width, 1),
    height: Math.max(rect.height, 1),
  }
}

const toSvgMarkup = (svgElement: SVGSVGElement) => {
  const clone = svgElement.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  }

  return new XMLSerializer().serializeToString(clone)
}

const createSvgBlob = (svgElement: SVGSVGElement) => {
  const markup = toSvgMarkup(svgElement)
  return new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
}

const isTaintedCanvasError = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'SecurityError') {
    return true
  }

  if (error instanceof Error) {
    return /tainted canvas/i.test(error.message)
  }

  if (typeof error === 'string') {
    return /tainted canvas/i.test(error)
  }

  return false
}

const renderPngBlob = async (svgElement: SVGSVGElement) => {
  const { width, height } = getSvgSize(svgElement)
  const svgMarkup = toSvgMarkup(svgElement)
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to decode SVG for PNG export.'))
      img.src = dataUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(Math.round(width * 2), 1)
    canvas.height = Math.max(Math.round(height * 2), 1)

    const context = canvas.getContext('2d')
    if (!context) {
      return null
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return await new Promise<Blob | null>((resolve, reject) => {
      try {
        canvas.toBlob(blob => resolve(blob), 'image/png')
      } catch (error) {
        reject(error)
      }
    })
  } catch (error) {
    if (isTaintedCanvasError(error)) {
      return null
    }

    throw error
  }
}

const triggerDownload = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(href)
}

const copySvgAsImage = async (svgElement: SVGSVGElement) => {
  if (!navigator.clipboard) {
    return
  }

  const svgMarkup = toSvgMarkup(svgElement)
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })

  try {
    const pngBlob = await renderPngBlob(svgElement)

    if (pngBlob && 'ClipboardItem' in window && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        [pngBlob.type]: pngBlob,
      })
      await navigator.clipboard.write([clipboardItem])
      return
    }

    if ('ClipboardItem' in window && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        [svgBlob.type]: svgBlob,
      })
      await navigator.clipboard.write([clipboardItem])
      return
    }
  } catch {
    // fall through to text fallback
  }

  if (navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(svgMarkup)
  }
}

export const createMarkdownMermaidPlugin = (options?: MarkdownMermaidPluginOptions) => {
  const mermaidOptions = options?.mermaidOptions ?? {}
  const labels: MarkdownDiagramViewerLabels = {
    ...defaultMarkdownDiagramViewerLabels,
    imageTab: 'Image',
    ...(options?.labels ?? {}),
  }

  return createMarkdownPlugin({
    name: 'mermaid',
    setup: ({ md }) => {
      if (typeof markdownItMermaid === 'function') {
        md.use(markdownItMermaid as never, mermaidOptions)
      }
    },
    onRendered: async ({ container, shadowRoot }) => {
      ensureMarkdownDiagramViewerStyles(shadowRoot)

      const mermaidNodes = Array.from(container.querySelectorAll<HTMLElement>('.mermaid'))
      if (mermaidNodes.length === 0) {
        return
      }

      const runtimeMermaidOptions = {
        startOnLoad: false,
        ...mermaidOptions,
      }
      const optionsKey = createOptionsKey(runtimeMermaidOptions)

      if (optionsKey !== initializedMermaidOptionsKey) {
        mermaid.initialize(runtimeMermaidOptions)
        initializedMermaidOptionsKey = optionsKey
      }

      const cleanupFns: Array<() => void> = []
      const renderIdPrefix = `markdown-mermaid-${Date.now()}`

      for (const [index, node] of mermaidNodes.entries()) {
        const source = normalizeSource(node)
        if (!source) {
          continue
        }

        const renderId = `${renderIdPrefix}-${index}`

        try {
          const rendered = await mermaidRuntime.render(renderId, source)

          node.innerHTML = ''
          node.classList.add('markdown-diagram')
          node.setAttribute('data-processed', 'true')

          const imageContent = document.createElement('div')
          imageContent.innerHTML = rendered.svg
          const svgElement = imageContent.querySelector<SVGSVGElement>('svg')

          if (svgElement) {
            normalizeSvgLayout(svgElement)
            requestAnimationFrame(() => normalizeSvgLayout(svgElement))
          }

          const exportBaseName = options?.exportFileName?.(index) ?? `mermaid-diagram-${index + 1}`

          const copyImage = svgElement
            ? () => {
                void copySvgAsImage(svgElement)
              }
            : undefined

          const downloadImage = svgElement
            ? async () => {
                try {
                  const pngBlob = await renderPngBlob(svgElement)
                  if (pngBlob) {
                    triggerDownload(pngBlob, `${exportBaseName}.png`)
                    return
                  }
                } catch {
                  // fall through to svg fallback
                }
                triggerDownload(createSvgBlob(svgElement), `${exportBaseName}.svg`)
              }
            : undefined

          const modalImageContent = () => {
            const wrapper = document.createElement('div')
            if (svgElement) {
              const clone = svgElement.cloneNode(true) as SVGSVGElement
              normalizeSvgLayout(clone)
              wrapper.append(clone)
            }
            return wrapper
          }

          const bindModalImage = (element: HTMLElement) => {
            rendered.bindFunctions?.(element)
          }

          const viewer = createMarkdownDiagramViewer({
            shadowRoot,
            source,
            imageContent,
            codeLanguage: 'mermaid',
            labels,
            view: options?.view,
            exportFileName: exportBaseName,
            copyImage,
            downloadImage,
            modalImageContent,
            bindModalImage,
          })

          node.append(viewer.element)

          rendered.bindFunctions?.(viewer.imageInner)

          cleanupFns.push(() => viewer.cleanup())
        } catch (error) {
          renderMarkdownDiagramError(
            node,
            'Mermaid render failed',
            source,
            extractErrorMessage(error),
          )
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
