import markdownItSpoiler from '@traptitech/markdown-it-spoiler'
import { createMarkdownPlugin } from '../../index'

export const createMarkdownSpoilerPlugin = () => {
  return createMarkdownPlugin({
    name: 'spoiler',
    setup: ({ md }) => {
      md.use(markdownItSpoiler as never)
    },
    onRendered: ({ container, shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-spoiler-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-spoiler-styles', '')
        styleEl.textContent = `
          .markdown-content .spoiler {
            border-radius: 0.25rem;
            background: color-mix(in oklch, var(--foreground) 80%, transparent);
            color: transparent;
            cursor: pointer;
            transition: color 120ms ease, background-color 120ms ease;
            padding: 0 0.25em;
            user-select: none;
          }

          .markdown-content .spoiler.is-visible {
            background: color-mix(in oklch, var(--muted) 40%, transparent);
            color: inherit;
          }
        `
        shadowRoot.prepend(styleEl)
      }

      const cleanups: Array<() => void> = []
      const spoilers = container.querySelectorAll<HTMLElement>('.spoiler')

      for (const spoiler of spoilers) {
        if (spoiler.dataset.markdownSpoilerBound === 'true') {
          continue
        }

        spoiler.dataset.markdownSpoilerBound = 'true'
        spoiler.setAttribute('tabindex', '0')
        spoiler.setAttribute('role', 'button')

        const reveal = () => spoiler.classList.add('is-visible')
        const keydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            reveal()
          }
        }

        spoiler.addEventListener('click', reveal)
        spoiler.addEventListener('keydown', keydown)

        cleanups.push(() => {
          spoiler.removeEventListener('click', reveal)
          spoiler.removeEventListener('keydown', keydown)
          spoiler.classList.remove('is-visible')
          delete spoiler.dataset.markdownSpoilerBound
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
