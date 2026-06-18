import { createMarkdownVegaBasePlugin, type MarkdownVegaBasePluginOptions } from '../_shared/vega'

export type MarkdownVegaLitePluginOptions = MarkdownVegaBasePluginOptions

export const createMarkdownVegaLitePlugin = (options?: MarkdownVegaLitePluginOptions) =>
  createMarkdownVegaBasePlugin(
    {
      name: 'vega-lite',
      fenceName: 'vega-lite',
      dataAttribute: 'data-vega-lite',
      codeLanguage: 'json',
      defaultExportPrefix: 'vega-lite-chart',
      errorTitle: 'Vega-Lite render failed',
      defaultImageTabLabel: 'Chart',
    },
    options,
  )
