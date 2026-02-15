import type { ComponentProps, Accessor } from 'solid-js'
import { mergeProps, onCleanup, onMount, splitProps } from 'solid-js'
import type { Options, Tabulator } from 'tabulator-tables'
import { TabulatorFull } from 'tabulator-tables'

export type DataTableProps = ComponentProps<'div'> & {
  /** Tabulator options configuration */
  initOptions: Options | Accessor<Options>
  /** Callback fired when the Tabulator instance is initialized */
  onInit?: (tabulator: Tabulator) => void
  /** Callback fired when the Tabulator instance is destroyed */
  onDestroy?: () => void
}

export function TabulatorTable(props: DataTableProps) {
  const merged = mergeProps<DataTableProps[]>(
    {
      initOptions: {},
    },
    props,
  )

  const [, rest] = splitProps(merged, ['initOptions', 'onInit', 'onDestroy', 'class', 'style'])

  let tableElement: HTMLDivElement | undefined

  // Initialize Tabulator instance
  onMount(() => {
    if (!tableElement) return

    const options =
      typeof merged.initOptions === 'function' ? merged.initOptions() : merged.initOptions

    tableElement.style.setProperty(
      '--shadcn-tabulator-row-height',
      (options?.rowHeight ?? 36) + 'px',
    )

    // Create Tabulator instance
    const instance = new TabulatorFull(tableElement, options)
    instance.on('tableBuilt', () => {
      merged.onInit?.(instance)
    })

    // Cleanup on unmount
    onCleanup(() => {
      instance.destroy()
      merged.onDestroy?.()
    })
  })

  return <div {...rest} ref={tableElement} class={merged.class} style={merged.style} />
}
