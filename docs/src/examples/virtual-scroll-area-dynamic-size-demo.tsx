import { VirtualScrollArea } from 'shadcn-solid-components/components/virtual-scroll-area'

const dynamicRows = Array.from({ length: 2000 }, (_, index) => ({
  id: index,
  title: `Message ${index + 1}`,
  lines: (index % 4) + 1,
}))

const VirtualScrollAreaDynamicSizeDemo = () => {
  return (
    <VirtualScrollArea
      mode="vertical"
      rowCount={dynamicRows.length}
      measureRow
      overscan={8}
      estimateRowSize={index => {
        const row = dynamicRows[index]
        if (!row) {
          return 48
        }

        return 36 + row.lines * 22
      }}
      class="h-80 w-full rounded-md border"
      renderRow={({ rowIndex }) => {
        const row = dynamicRows[rowIndex]
        if (!row) {
          return null
        }

        return (
          <article class="border-b px-4 py-2.5">
            <h4 class="text-sm font-medium">{row.title}</h4>
            <p class="text-muted-foreground mt-1 text-xs leading-relaxed">
              {Array.from(
                { length: row.lines },
                () => 'Dynamic row height content for virtualization measurement.',
              ).join(' ')}
            </p>
          </article>
        )
      }}
    />
  )
}

export default VirtualScrollAreaDynamicSizeDemo
