import svgPanZoom from 'svg-pan-zoom'
import copyIconSvg from '../copy/copy.svg?raw'
import downloadIconSvg from '../mermaid/icons/download.svg?raw'
import fitIconSvg from '../mermaid/icons/fit.svg?raw'
import fullscreenIconSvg from '../mermaid/icons/fullscreen.svg?raw'
import zoomInIconSvg from '../mermaid/icons/zoom-in.svg?raw'
import zoomOutIconSvg from '../mermaid/icons/zoom-out.svg?raw'
import viewerStyles from './viewer.css?inline'

export type MarkdownDiagramViewMode = 'image' | 'code'

export type MarkdownDiagramViewerLabels = {
  imageTab: string
  codeTab: string
  copyImage: string
  copySource: string
  downloadImage: string
  downloadSource: string
  zoomIn: string
  zoomOut: string
  fitToScreen: string
  fullscreen: string
  close: string
}

export type MarkdownDiagramViewerOptions = {
  defaultView?: MarkdownDiagramViewMode
  enableCopy?: boolean
  enableDownload?: boolean
  enableZoom?: boolean
  enableFullscreen?: boolean
}

type SvgPanZoomInstance = {
  destroy?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  fit?: () => void
  center?: () => void
  resize?: () => void
}

type DiagramActionIcon = 'copy' | 'download' | 'zoomIn' | 'zoomOut' | 'fit' | 'fullscreen' | 'close'

type MarkdownDiagramViewerParams = {
  shadowRoot: ShadowRoot
  source: string
  imageContent: Node
  codeLanguage: string
  labels: MarkdownDiagramViewerLabels
  view?: MarkdownDiagramViewerOptions
  exportFileName: string
  copyImage?: () => void | Promise<void>
  downloadImage?: () => void | Promise<void>
  modalImageContent?: () => Node
  bindModalImage?: (element: HTMLElement) => void
}

const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`

const diagramActionIconSvgs: Record<DiagramActionIcon, string> = {
  copy: copyIconSvg,
  download: downloadIconSvg,
  zoomIn: zoomInIconSvg,
  zoomOut: zoomOutIconSvg,
  fit: fitIconSvg,
  fullscreen: fullscreenIconSvg,
  close: closeIconSvg,
}

export const defaultMarkdownDiagramViewerLabels: MarkdownDiagramViewerLabels = {
  imageTab: 'Chart',
  codeTab: 'Code',
  copyImage: 'Copy Image',
  copySource: 'Copy Source',
  downloadImage: 'Download Image',
  downloadSource: 'Download Source',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  fitToScreen: 'Fit',
  fullscreen: 'Fullscreen',
  close: 'Close',
}

export const ensureMarkdownDiagramViewerStyles = (shadowRoot: ShadowRoot) => {
  if (shadowRoot.querySelector('style[data-markdown-diagram-viewer-styles]')) {
    return
  }

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-markdown-diagram-viewer-styles', '')
  styleEl.textContent = viewerStyles
  shadowRoot.prepend(styleEl)
}

export const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export const extractErrorMessage = (error: unknown) => {
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
    return 'Unknown render error.'
  }

  return 'Unknown render error.'
}

export const renderMarkdownDiagramError = (
  node: HTMLElement,
  title: string,
  source: string,
  message: string,
) => {
  node.innerHTML = `
    <div class="markdown-diagram-error" data-markdown-diagram-error="true">
      <div class="markdown-diagram-error-title">${escapeHtml(title)}</div>
      <pre class="markdown-diagram-error-message">${escapeHtml(message)}</pre>
      <details>
        <summary>Diagram source</summary>
        <pre class="markdown-diagram-error-source">${escapeHtml(source)}</pre>
      </details>
    </div>
  `
}

const createActionButton = (label: string, variant: 'tab' | 'icon') => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = variant === 'tab' ? 'markdown-diagram__tab' : 'markdown-diagram__action-button'
  if (variant === 'tab') {
    button.textContent = label
  }
  button.setAttribute('aria-label', label)
  button.title = label
  return button
}

const createIconElement = (icon: DiagramActionIcon) => {
  const template = document.createElement('template')
  template.innerHTML = diagramActionIconSvgs[icon].trim()
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

const createIconButton = (label: string, icon: DiagramActionIcon) => {
  const button = createActionButton(label, 'icon')
  button.append(createIconElement(icon))
  return button
}

const updateTabIndicator = (root: HTMLElement) => {
  const tabs = root.querySelector<HTMLElement>('.markdown-diagram__tabs')
  const indicator = root.querySelector<HTMLElement>('.markdown-diagram__tab-indicator')
  const activeTab = tabs?.querySelector<HTMLElement>('.markdown-diagram__tab.is-active')

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

const setView = (root: HTMLElement, mode: MarkdownDiagramViewMode) => {
  root.setAttribute('data-view', mode)

  const imageTab = root.querySelector<HTMLButtonElement>('[data-markdown-diagram-tab="image"]')
  const codeTab = root.querySelector<HTMLButtonElement>('[data-markdown-diagram-tab="code"]')

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

const triggerDownload = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(href)
}

const downloadText = (source: string, fileName: string) => {
  triggerDownload(new Blob([source], { type: 'application/json;charset=utf-8' }), fileName)
}

const copySource = async (source: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(source)
  }
}

const findSvgElement = (element: HTMLElement) => element.querySelector<SVGSVGElement>('svg')

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

export const normalizeSvgLayout = (svgElement: SVGSVGElement) => {
  ensureSvgViewBox(svgElement)
  svgElement.setAttribute('width', '100%')
  svgElement.setAttribute('height', '100%')
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svgElement.style.removeProperty('max-width')
  svgElement.style.width = '100%'
  svgElement.style.height = '100%'
}

const setupPanZoom = (element: HTMLElement) => {
  const svgElement = findSvgElement(element)
  if (!svgElement) {
    return null
  }

  normalizeSvgLayout(svgElement)

  const init = () => {
    normalizeSvgLayout(svgElement)
    const rect = svgElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(init)
      return
    }

    instance = svgPanZoom(svgElement, {
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.25,
      maxZoom: 16,
      zoomScaleSensitivity: 0.3,
    }) as SvgPanZoomInstance | null
  }

  let instance: SvgPanZoomInstance | null = null
  requestAnimationFrame(init)

  return {
    destroy: () => instance?.destroy?.(),
    zoomIn: () => instance?.zoomIn?.(),
    zoomOut: () => instance?.zoomOut?.(),
    fit: () => {
      instance?.fit?.()
      instance?.center?.()
      instance?.resize?.()
    },
    center: () => instance?.center?.(),
    resize: () => instance?.resize?.(),
  } as SvgPanZoomInstance
}

export const createMarkdownDiagramViewer = (params: MarkdownDiagramViewerParams) => {
  ensureMarkdownDiagramViewerStyles(params.shadowRoot)

  const viewConfig = {
    defaultView: params.view?.defaultView ?? 'image',
    enableCopy: params.view?.enableCopy ?? true,
    enableDownload: params.view?.enableDownload ?? true,
    enableZoom: params.view?.enableZoom ?? true,
    enableFullscreen: params.view?.enableFullscreen ?? true,
  } as const
  const cleanupFns: Array<() => void> = []

  const root = document.createElement('section')
  root.className = 'markdown-diagram__root'

  const header = document.createElement('div')
  header.className = 'markdown-diagram__header'

  const tabs = document.createElement('div')
  tabs.className = 'markdown-diagram__tabs'
  tabs.setAttribute('data-slot', 'tabs-list')

  const tabIndicator = document.createElement('div')
  tabIndicator.className = 'markdown-diagram__tab-indicator'
  tabIndicator.setAttribute('aria-hidden', 'true')

  const imageTab = createActionButton(params.labels.imageTab, 'tab')
  imageTab.setAttribute('data-markdown-diagram-tab', 'image')
  imageTab.setAttribute('data-slot', 'tabs-trigger')

  const codeTab = createActionButton(params.labels.codeTab, 'tab')
  codeTab.setAttribute('data-markdown-diagram-tab', 'code')
  codeTab.setAttribute('data-slot', 'tabs-trigger')

  tabs.append(tabIndicator, imageTab, codeTab)

  const actions = document.createElement('div')
  actions.className = 'markdown-diagram__actions'

  const body = document.createElement('div')
  body.className = 'markdown-diagram__body'

  const codeContainer = document.createElement('pre')
  codeContainer.className = 'markdown-diagram__code'
  const codeElement = document.createElement('code')
  codeElement.className = `language-${params.codeLanguage}`
  codeElement.textContent = params.source
  codeContainer.append(codeElement)

  const imageContainer = document.createElement('div')
  imageContainer.className = 'markdown-diagram__image'
  const imageInner = document.createElement('div')
  imageInner.className = 'markdown-diagram__image-inner'
  imageInner.append(params.imageContent)
  imageContainer.append(imageInner)
  body.append(codeContainer, imageContainer)

  header.append(tabs, actions)
  root.append(header, body)

  let currentView: MarkdownDiagramViewMode = viewConfig.defaultView === 'code' ? 'code' : 'image'
  let copyButton: HTMLButtonElement | null = null
  let downloadButton: HTMLButtonElement | null = null

  setView(root, currentView)

  const updateActionLabels = () => {
    if (copyButton) {
      const label = currentView === 'image' ? params.labels.copyImage : params.labels.copySource
      copyButton.setAttribute('aria-label', label)
      copyButton.title = label
    }
    if (downloadButton) {
      const label =
        currentView === 'image' ? params.labels.downloadImage : params.labels.downloadSource
      downloadButton.setAttribute('aria-label', label)
      downloadButton.title = label
    }
  }

  requestAnimationFrame(() => updateTabIndicator(root))

  const onResize = () => updateTabIndicator(root)
  window.addEventListener('resize', onResize)

  const tabImageHandler = () => {
    currentView = 'image'
    setView(root, 'image')
    updateActionLabels()
  }
  const tabCodeHandler = () => {
    currentView = 'code'
    setView(root, 'code')
    updateActionLabels()
  }
  imageTab.addEventListener('click', tabImageHandler)
  codeTab.addEventListener('click', tabCodeHandler)

  cleanupFns.push(() => {
    window.removeEventListener('resize', onResize)
    imageTab.removeEventListener('click', tabImageHandler)
    codeTab.removeEventListener('click', tabCodeHandler)
  })

  let panZoomInstance: SvgPanZoomInstance | null = null
  if (viewConfig.enableZoom) {
    panZoomInstance = setupPanZoom(imageInner)

    if (panZoomInstance) {
      const zoomInButton = createIconButton(params.labels.zoomIn, 'zoomIn')
      const zoomOutButton = createIconButton(params.labels.zoomOut, 'zoomOut')
      const fitButton = createIconButton(params.labels.fitToScreen, 'fit')

      const onZoomIn = () => panZoomInstance?.zoomIn?.()
      const onZoomOut = () => panZoomInstance?.zoomOut?.()
      const onFit = () => {
        panZoomInstance?.fit?.()
        panZoomInstance?.center?.()
        panZoomInstance?.resize?.()
      }

      zoomInButton.addEventListener('click', onZoomIn)
      zoomOutButton.addEventListener('click', onZoomOut)
      fitButton.addEventListener('click', onFit)
      actions.append(zoomInButton, zoomOutButton, fitButton)

      cleanupFns.push(() => {
        zoomInButton.removeEventListener('click', onZoomIn)
        zoomOutButton.removeEventListener('click', onZoomOut)
        fitButton.removeEventListener('click', onFit)
      })
    }
  }

  let copyHandler: (() => void) | null = null

  if (viewConfig.enableCopy) {
    copyButton = createIconButton(params.labels.copyImage, 'copy')

    const onCopy = () => {
      if (currentView === 'image' && params.copyImage) {
        void params.copyImage()
        return
      }

      void copySource(params.source)
    }
    copyHandler = onCopy
    copyButton.addEventListener('click', onCopy)
    actions.append(copyButton)

    cleanupFns.push(() => {
      if (copyButton && copyHandler) {
        copyButton.removeEventListener('click', copyHandler)
      }
    })
  }

  let downloadHandler: (() => void) | null = null

  if (viewConfig.enableDownload) {
    downloadButton = createIconButton(params.labels.downloadImage, 'download')

    const onDownload = () => {
      if (currentView === 'image' && params.downloadImage) {
        void params.downloadImage()
        return
      }

      downloadText(params.source, `${params.exportFileName}.json`)
    }
    downloadHandler = onDownload
    downloadButton.addEventListener('click', onDownload)
    actions.append(downloadButton)

    cleanupFns.push(() => {
      if (downloadButton && downloadHandler) {
        downloadButton.removeEventListener('click', downloadHandler)
      }
    })
  }

  updateActionLabels()

  if (viewConfig.enableFullscreen) {
    const fullscreenButton = createIconButton(params.labels.fullscreen, 'fullscreen')
    let closeModal: (() => void) | null = null

    const onFullscreen = () => {
      if (closeModal) {
        closeModal()
        return
      }

      const overlay = document.createElement('div')
      overlay.className = 'markdown-diagram__modal-overlay'
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      overlay.setAttribute('aria-label', params.labels.fullscreen)

      const backdrop = document.createElement('div')
      backdrop.className = 'markdown-diagram__modal-backdrop'

      const panel = document.createElement('div')
      panel.className = 'markdown-diagram__modal-panel'

      const controls = document.createElement('div')
      controls.className = 'markdown-diagram__modal-controls'

      const closeButton = createIconButton(params.labels.close, 'close')
      closeButton.classList.add('markdown-diagram__modal-control-button')

      const modalDownloadButton = createIconButton(params.labels.downloadImage, 'download')
      modalDownloadButton.classList.add('markdown-diagram__modal-control-button')

      const viewer = document.createElement('div')
      viewer.className = 'markdown-diagram__modal-viewer'

      const viewerInner = document.createElement('div')
      viewerInner.className = 'markdown-diagram__modal-viewer-inner'
      viewerInner.append(params.modalImageContent?.() ?? params.imageContent.cloneNode(true))
      viewer.append(viewerInner)
      controls.append(closeButton)

      if (viewConfig.enableDownload) {
        controls.append(modalDownloadButton)
      }

      panel.append(controls, viewer)
      overlay.append(backdrop, panel)
      params.shadowRoot.append(overlay)
      params.bindModalImage?.(viewerInner)

      const modalPanZoom = setupPanZoom(viewerInner)
      modalPanZoom?.fit?.()
      modalPanZoom?.center?.()

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
        if (params.downloadImage) {
          void params.downloadImage()
          return
        }

        downloadText(params.source, `${params.exportFileName}.json`)
      }

      closeModal = () => {
        document.removeEventListener('keydown', keydownHandler)
        closeButton.removeEventListener('click', closeHandler)
        modalDownloadButton.removeEventListener('click', downloadHandler)
        modalPanZoom?.destroy?.()
        overlay.remove()
        closeModal = null
        fullscreenButton.focus()
      }

      closeButton.addEventListener('click', closeHandler)
      modalDownloadButton.addEventListener('click', downloadHandler)
      document.addEventListener('keydown', keydownHandler)
    }

    const onFullscreenClick = () => onFullscreen()
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

  return {
    element: root,
    imageInner,
    cleanup: () => {
      for (const cleanup of cleanupFns) {
        cleanup()
      }
    },
  }
}
