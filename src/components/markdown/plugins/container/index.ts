import markdownItContainer from 'markdown-it-container'
import { createMarkdownPlugin } from '../../index'

export type MarkdownContainerPluginOptions = {
  name?: string
  options?: Record<string, unknown>
}

export const createMarkdownContainerPlugin = (options?: MarkdownContainerPluginOptions) => {
  const containerName = options?.name ?? 'info'

  return createMarkdownPlugin({
    name: 'container',
    setup: ({ md }) => {
      const markdownIt = md as any

      if (options?.options === undefined) {
        markdownIt.use(markdownItContainer as never, containerName)
        return
      }

      markdownIt.use(markdownItContainer as never, containerName, options.options)
    },
  })
}
