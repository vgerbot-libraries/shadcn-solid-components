import { createMarkdownVegaBasePlugin, type MarkdownVegaBasePluginOptions } from '../_shared/vega'

export type MarkdownVegaPluginOptions = MarkdownVegaBasePluginOptions

export const createMarkdownVegaPlugin = (options?: MarkdownVegaPluginOptions) =>
  createMarkdownVegaBasePlugin(
    {
      name: 'vega',
      fenceName: 'vega',
      dataAttribute: 'data-vega',
      codeLanguage: 'json',
      defaultExportPrefix: 'vega-chart',
      errorTitle: 'Vega render failed',
      defaultImageTabLabel: 'Chart',
    },
    options,
  )
