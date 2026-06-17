import * as markdownItMermaidModule from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'
import { createMarkdownPlugin } from '../../index'
import copyIconSvg from '../copy/copy.svg?raw'
import downloadIconSvg from './icons/download.svg?raw'
import fitIconSvg from './icons/fit.svg?raw'
import fullscreenIconSvg from './icons/fullscreen.svg?raw'
import zoomInIconSvg from './icons/zoom-in.svg?raw'
import zoomOutIconSvg from './icons/zoom-out.svg?raw'
import mermaidStyles from './index.css?inline'

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

type SvgPanZoomInstance = {
  destroy?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  fit?: () => void
  center?: () => void
  resize?: () => void
}

type MermaidViewMode = 'image' | 'code'

type MermaidActionLabels = {
  imageTab: string
  codeTab: string
  copyImage: string
  downloadImage: string
  zoomIn: string
  zoomOut: string
  fitToScreen: string
  fullscreen: string
}

type MermaidViewOptions = {
  defaultView?: MermaidViewMode
  enableCopy?: boolean
  enableDownload?: boolean
  enableZoom?: boolean
  enableFullscreen?: boolean
}

type MermaidActionIcon = 'copy' | 'download' | 'zoomIn' | 'zoomOut' | 'fit' | 'fullscreen' | 'close'

export type MarkdownMermaidPluginOptions = {
  mermaidOptions?: Record<string, unknown>
  view?: MermaidViewOptions
  labels?: Partial<MermaidActionLabels>
  exportFileName?: (index: number) => string
}

const mermaidRuntime = mermaid as MermaidRuntime

const defaultLabels: MermaidActionLabels = {
  imageTab: 'Image',
  codeTab: 'Code',
  copyImage: 'Copy Image',
  downloadImage: 'Download Image',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  fitToScreen: 'Fit',
  fullscreen: 'Fullscreen',
}

const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`

const mermaidActionIconSvgs: Record<MermaidActionIcon, string> = {
  copy: copyIconSvg,
  download: downloadIconSvg,
  zoomIn: zoomInIconSvg,
  zoomOut: zoomOutIconSvg,
  fit: fitIconSvg,
  fullscreen: fullscreenIconSvg,
  close: closeIconSvg,
}

const ensureStyles = (shadowRoot: ShadowRoot) => {
  if (shadowRoot.querySelector('style[data-markdown-mermaid-styles]')) {
    return
  }

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-markdown-mermaid-styles', '')
  styleEl.textContent = mermaidStyles
  shadowRoot.prepend(styleEl)
}

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

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const extractErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim()
  }

  try {
    const parsed = JSON.stringify(error)
    if (parsed) {
      return parsed
    }
  } catch {
    return 'Unknown Mermaid render error.'
  }

  return 'Unknown Mermaid render error.'
}

const renderError = (node: HTMLElement, source: string, message: string) => {
  node.innerHTML = `
    <div class="markdown-mermaid-error" data-mermaid-error="true">
      <div class="markdown-mermaid-error-title">Mermaid render failed</div>
      <pre class="markdown-mermaid-error-message">${escapeHtml(message)}</pre>
      <details>
        <summary>Diagram source</summary>
        <pre class="markdown-mermaid-error-source">${escapeHtml(source)}</pre>
      </details>
    </div>
  `
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

const createActionButton = (label: string, variant: 'tab' | 'icon') => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = variant === 'tab' ? 'markdown-mermaid__tab' : 'markdown-mermaid__action-button'
  if (variant === 'tab') {
    button.textContent = label
  }
  button.setAttribute('aria-label', label)
  button.title = label
  return button
}

const createIconElement = (icon: MermaidActionIcon) => {
  const template = document.createElement('template')
  template.innerHTML = mermaidActionIconSvgs[icon].trim()
  const svg = template.content.firstElementChild

  if (svg instanceof SVGSVGElement) {
    return svg
  }

  const fallback = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  fallback.setAttribute('viewBox', '0 0 24 24')
  fallback.setAttribute('width', '16')
  fallback.setAttribute('height', '16')
  fallback.setAttribute('aria-hidden', 'true')
  return fallback
}

const createIconButton = (label: string, icon: MermaidActionIcon) => {
  const button = createActionButton(label, 'icon')
  button.append(createIconElement(icon))
  return button
}

const ensureSvgViewBox = (svgElement: SVGSVGElement) => {
  const currentViewBox = svgElement.viewBox?.baseVal
  if (currentViewBox && currentViewBox.width > 0 && currentViewBox.height > 0) {
    return
  }

  const viewport = svgElement.querySelector<SVGGElement>('.svg-pan-zoom_viewport')
  const fallbackTarget = svgElement.querySelector<SVGGraphicsElement>('g')
  const target = viewport ?? fallbackTarget

  if (!target || typeof target.getBBox !== 'function') {
    return
  }

  try {
    const bbox = target.getBBox()
    if (bbox.width > 0 && bbox.height > 0) {
      svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
    }
  } catch {
    return
  }
}

const normalizeSvgLayout = (svgElement: SVGSVGElement) => {
  ensureSvgViewBox(svgElement)
  svgElement.setAttribute('width', '100%')
  svgElement.setAttribute('height', '100%')
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svgElement.style.removeProperty('max-width')
  svgElement.style.width = '100%'
  svgElement.style.height = '100%'
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

const updateTabIndicator = (root: HTMLElement) => {
  const tabs = root.querySelector<HTMLElement>('.markdown-mermaid__tabs')
  const indicator = root.querySelector<HTMLElement>('.markdown-mermaid__tab-indicator')
  const activeTab = tabs?.querySelector<HTMLElement>('.markdown-mermaid__tab.is-active')

  if (!tabs || !indicator || !activeTab) {
    return
  }

  const left = activeTab.offsetLeft
  const top = activeTab.offsetTop
  const width = activeTab.offsetWidth
  const height = activeTab.offsetHeight

  indicator.style.width = `${width}px`
  indicator.style.height = `${height}px`
  indicator.style.transform = `translate(${left}px, ${top}px)`
}

const setView = (root: HTMLElement, mode: MermaidViewMode) => {
  root.setAttribute('data-view', mode)

  const imageTab = root.querySelector<HTMLButtonElement>('[data-mermaid-tab="image"]')
  const codeTab = root.querySelector<HTMLButtonElement>('[data-mermaid-tab="code"]')

  if (imageTab) {
    imageTab.setAttribute('aria-pressed', String(mode === 'image'))
    imageTab.classList.toggle('is-active', mode === 'image')
  }

  if (codeTab) {
    codeTab.setAttribute('aria-pressed', String(mode === 'code'))
    codeTab.classList.toggle('is-active', mode === 'code')
  }

  updateTabIndicator(root)
}

export const createMarkdownMermaidPlugin = (options?: MarkdownMermaidPluginOptions) => {
  const mermaidOptions = options?.mermaidOptions ?? {}
  const viewConfig = {
    defaultView: options?.view?.defaultView ?? 'image',
    enableCopy: options?.view?.enableCopy ?? true,
    enableDownload: options?.view?.enableDownload ?? true,
    enableZoom: options?.view?.enableZoom ?? true,
    enableFullscreen: options?.view?.enableFullscreen ?? true,
  } as const
  const labels = {
    ...defaultLabels,
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
      ensureStyles(shadowRoot)

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
          node.classList.add('markdown-mermaid')
          node.setAttribute('data-processed', 'true')

          const root = document.createElement('section')
          root.className = 'markdown-mermaid__root'

          const header = document.createElement('div')
          header.className = 'markdown-mermaid__header'

          const tabs = document.createElement('div')
          tabs.className = 'markdown-mermaid__tabs'
          tabs.setAttribute('data-slot', 'tabs-list')

          const tabIndicator = document.createElement('div')
          tabIndicator.className = 'markdown-mermaid__tab-indicator'
          tabIndicator.setAttribute('aria-hidden', 'true')

          const imageTab = createActionButton(labels.imageTab, 'tab')
          imageTab.setAttribute('data-mermaid-tab', 'image')
          imageTab.setAttribute('data-slot', 'tabs-trigger')

          const codeTab = createActionButton(labels.codeTab, 'tab')
          codeTab.setAttribute('data-mermaid-tab', 'code')
          codeTab.setAttribute('data-slot', 'tabs-trigger')

          tabs.append(tabIndicator, imageTab, codeTab)

          const actions = document.createElement('div')
          actions.className = 'markdown-mermaid__actions'

          const body = document.createElement('div')
          body.className = 'markdown-mermaid__body'

          const codeContainer = document.createElement('pre')
          codeContainer.className = 'markdown-mermaid__code'
          const codeElement = document.createElement('code')
          codeElement.className = 'language-mermaid'
          codeElement.textContent = source
          codeContainer.append(codeElement)

          const imageContainer = document.createElement('div')
          imageContainer.className = 'markdown-mermaid__image'
          const imageInner = document.createElement('div')
          imageInner.className = 'markdown-mermaid__image-inner'
          imageInner.innerHTML = rendered.svg
          const svgElement = imageInner.querySelector<SVGSVGElement>('svg')

          imageContainer.append(imageInner)
          body.append(codeContainer, imageContainer)

          header.append(tabs, actions)
          root.append(header, body)
          node.append(root)

          if (svgElement) {
            normalizeSvgLayout(svgElement)
            requestAnimationFrame(() => normalizeSvgLayout(svgElement))
          }

          rendered.bindFunctions?.(imageInner)

          const viewMode = viewConfig.defaultView === 'code' ? 'code' : 'image'
          setView(root, viewMode)
          requestAnimationFrame(() => updateTabIndicator(root))

          const onResize = () => updateTabIndicator(root)
          window.addEventListener('resize', onResize)

          const tabImageHandler = () => setView(root, 'image')
          const tabCodeHandler = () => setView(root, 'code')
          imageTab.addEventListener('click', tabImageHandler)
          codeTab.addEventListener('click', tabCodeHandler)

          cleanupFns.push(() => {
            window.removeEventListener('resize', onResize)
            imageTab.removeEventListener('click', tabImageHandler)
            codeTab.removeEventListener('click', tabCodeHandler)
          })

          let panZoomInstance: SvgPanZoomInstance | null = null

          if (svgElement && viewConfig.enableZoom) {
            panZoomInstance = svgPanZoom(svgElement, {
              controlIconsEnabled: false,
              fit: true,
              center: true,
              minZoom: 0.25,
              maxZoom: 16,
              zoomScaleSensitivity: 0.3,
            }) as SvgPanZoomInstance

            const fitButton = createIconButton(labels.fitToScreen, 'fit')

            const onFit = () => {
              panZoomInstance?.fit?.()
              panZoomInstance?.center?.()
              panZoomInstance?.resize?.()
            }

            fitButton.addEventListener('click', onFit)

            actions.append(fitButton)

            cleanupFns.push(() => {
              fitButton.removeEventListener('click', onFit)
            })
          }

          if (svgElement && viewConfig.enableCopy) {
            const copyButton = createIconButton(labels.copyImage, 'copy')

            const onCopy = () => {
              void copySvgAsImage(svgElement)
            }

            copyButton.addEventListener('click', onCopy)
            actions.append(copyButton)

            cleanupFns.push(() => {
              copyButton.removeEventListener('click', onCopy)
            })
          }

          if (svgElement && viewConfig.enableDownload) {
            const downloadButton = createIconButton(labels.downloadImage, 'download')

            const onDownload = async () => {
              const baseName = options?.exportFileName?.(index) ?? `mermaid-diagram-${index + 1}`
              try {
                const pngBlob = await renderPngBlob(svgElement)

                if (pngBlob) {
                  triggerDownload(pngBlob, `${baseName}.png`)
                  return
                }
              } catch {
                // fall through to svg fallback
              }

              triggerDownload(createSvgBlob(svgElement), `${baseName}.svg`)
            }

            const onDownloadClick = () => {
              void onDownload()
            }

            downloadButton.addEventListener('click', onDownloadClick)
            actions.append(downloadButton)

            cleanupFns.push(() => {
              downloadButton.removeEventListener('click', onDownloadClick)
            })
          }

          if (viewConfig.enableFullscreen) {
            const fullscreenButton = createIconButton(labels.fullscreen, 'fullscreen')
            let closeModal: (() => void) | null = null

            const onFullscreen = async () => {
              if (!svgElement) {
                return
              }

              if (closeModal) {
                closeModal()
                return
              }

              const overlay = document.createElement('div')
              overlay.className = 'markdown-mermaid__modal-overlay'
              overlay.setAttribute('role', 'dialog')
              overlay.setAttribute('aria-modal', 'true')
              overlay.setAttribute('aria-label', labels.fullscreen)

              const backdrop = document.createElement('div')
              backdrop.className = 'markdown-mermaid__modal-backdrop'

              const panel = document.createElement('div')
              panel.className = 'markdown-mermaid__modal-panel'

              const controls = document.createElement('div')
              controls.className = 'markdown-mermaid__modal-controls'

              const closeButton = createIconButton('Close', 'close')
              closeButton.classList.add('markdown-mermaid__modal-control-button')

              const modalDownloadButton = createIconButton(labels.downloadImage, 'download')
              modalDownloadButton.classList.add('markdown-mermaid__modal-control-button')

              const viewer = document.createElement('div')
              viewer.className = 'markdown-mermaid__modal-viewer'

              const viewerInner = document.createElement('div')
              viewerInner.className = 'markdown-mermaid__modal-viewer-inner'

              const modalSvg = svgElement.cloneNode(true) as SVGSVGElement
              normalizeSvgLayout(modalSvg)
              viewerInner.append(modalSvg)

              controls.append(closeButton)
              if (viewConfig.enableDownload) {
                controls.append(modalDownloadButton)
              }

              viewer.append(viewerInner)
              panel.append(controls, viewer)
              overlay.append(backdrop, panel)
              shadowRoot.append(overlay)

              rendered.bindFunctions?.(viewerInner)

              const modalPanZoom = svgPanZoom(modalSvg, {
                controlIconsEnabled: false,
                fit: true,
                center: true,
                minZoom: 0.25,
                maxZoom: 16,
                zoomScaleSensitivity: 0.3,
              }) as SvgPanZoomInstance

              modalPanZoom.fit?.()
              modalPanZoom.center?.()

              const onModalDownload = async () => {
                const baseName = options?.exportFileName?.(index) ?? `mermaid-diagram-${index + 1}`
                try {
                  const pngBlob = await renderPngBlob(modalSvg)

                  if (pngBlob) {
                    triggerDownload(pngBlob, `${baseName}.png`)
                    return
                  }
                } catch {
                  // fall through to svg fallback
                }

                triggerDownload(createSvgBlob(modalSvg), `${baseName}.svg`)
              }

              const closeHandler = () => {
                closeModal?.()
              }

              const keydownHandler = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  closeModal?.()
                }
              }

              const downloadHandler = () => {
                void onModalDownload()
              }

              closeModal = () => {
                document.removeEventListener('keydown', keydownHandler)
                closeButton.removeEventListener('click', closeHandler)
                modalDownloadButton.removeEventListener('click', downloadHandler)
                modalPanZoom.destroy?.()
                overlay.remove()
                closeModal = null
                fullscreenButton.focus()
              }

              closeButton.addEventListener('click', closeHandler)
              modalDownloadButton.addEventListener('click', downloadHandler)
              document.addEventListener('keydown', keydownHandler)
            }

            const onFullscreenClick = () => {
              void onFullscreen()
            }

            fullscreenButton.addEventListener('click', onFullscreenClick)
            actions.append(fullscreenButton)

            cleanupFns.push(() => {
              fullscreenButton.removeEventListener('click', onFullscreenClick)
              closeModal?.()
            })
          }

          cleanupFns.push(() => {
            panZoomInstance?.destroy?.()
            panZoomInstance = null
          })
        } catch (error) {
          renderError(node, source, extractErrorMessage(error))
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
