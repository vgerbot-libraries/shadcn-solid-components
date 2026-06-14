import markdownItTaskLists from 'markdown-it-task-lists'
import { createMarkdownPlugin } from '../../index'

export type MarkdownTaskListsPluginOptions = Record<string, unknown>

export const createMarkdownTaskListsPlugin = (options?: MarkdownTaskListsPluginOptions) => {
  return createMarkdownPlugin({
    name: 'task-lists',
    setup: ({ md }) => {
      if (options === undefined) {
        md.use(markdownItTaskLists as never)
        return
      }

      md.use(markdownItTaskLists as never, options)
    },
    onRendered: ({ shadowRoot }) => {
      if (!shadowRoot.querySelector('style[data-markdown-task-lists-styles]')) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-markdown-task-lists-styles', '')
        styleEl.textContent = `
          .markdown-content .contains-task-list {
            list-style: none;
            margin-left: 0;
            padding-left: 0;
          }

          .markdown-content .task-list-item {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .markdown-content .task-list-item-checkbox {
            margin-top: 0.25rem;
            accent-color: var(--primary);
          }
        `
        shadowRoot.prepend(styleEl)
      }
    },
  })
}
