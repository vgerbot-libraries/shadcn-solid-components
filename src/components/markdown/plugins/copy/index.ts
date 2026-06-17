import { createMarkdownPlugin } from '../../index'
import copyIconSvg from './copy.svg?raw'

export type MarkdownCopyPluginOptions = {
  buttonText?: string
  copiedText?: string
  copyTimeoutMs?: number
  selector?: string
}

export const createMarkdownCopyPlugin = (options?: MarkdownCopyPluginOptions) => {
  const config: Required<MarkdownCopyPluginOptions> = {
    buttonText: options?.buttonText ?? 'Copy',
    copiedText: options?.copiedText ?? 'Copied',
    copyTimeoutMs: options?.copyTimeoutMs ?? 1600,
    selector: options?.selector ?? 'pre',
  }

  return createMarkdownPlugin({
    name: 'copy',
    onRendered: ({ container, host }) => {
      const cleanups: Array<() => void> = []
      const blocks = container.querySelectorAll<HTMLElement>(config.selector)

      for (const block of blocks) {
        if (block.dataset.markdownCopyBound === 'true') {
          continue
        }

        const code = block.querySelector('code')
        if (!code) {
          continue
        }

        block.classList.add('shadcn-markdown-code-container')
        block.dataset.markdownCopyBound = 'true'

        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'shadcn-markdown-copy-button'
        button.title = config.buttonText
        button.setAttribute('aria-label', config.buttonText)
        button.innerHTML = copyIconSvg

        let timer = 0
        const onClick = async () => {
          const text = code.textContent ?? ''
          if (!text) {
            return
          }

          if (!navigator.clipboard?.writeText) {
            return
          }

          await navigator.clipboard.writeText(text)
          button.title = config.copiedText
          button.setAttribute('aria-label', config.copiedText)
          window.clearTimeout(timer)
          timer = window.setTimeout(() => {
            button.title = config.buttonText
            button.setAttribute('aria-label', config.buttonText)
          }, config.copyTimeoutMs)
        }

        const clickHandler = () => {
          void onClick()
        }

        button.addEventListener('click', clickHandler)
        block.append(button)

        cleanups.push(() => {
          window.clearTimeout(timer)
          button.removeEventListener('click', clickHandler)
          if (button.isConnected) {
            button.remove()
          }
          delete block.dataset.markdownCopyBound
        })
      }

      return () => {
        for (const cleanup of cleanups) {
          cleanup()
        }
      }
    },
  })
}
