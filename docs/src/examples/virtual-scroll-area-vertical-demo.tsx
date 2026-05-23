import { Badge } from 'shadcn-solid-components/components/badge'
import { VirtualScrollArea } from 'shadcn-solid-components/components/virtual-scroll-area'

const rowCount = 10000

const VirtualScrollAreaVerticalDemo = () => {
  return (
    <VirtualScrollArea
      mode="vertical"
      rowCount={rowCount}
      overscan={10}
      estimateRowSize={() => 44}
      class="h-80 w-full rounded-md border"
      renderRow={({ rowIndex }) => (
        <div class="flex h-full items-center justify-between border-b px-3 text-sm">
          <span class="font-medium">Log #{rowIndex + 1}</span>
          <Badge variant="outline">Row {rowIndex + 1}</Badge>
        </div>
      )}
    />
  )
}

export default VirtualScrollAreaVerticalDemo
