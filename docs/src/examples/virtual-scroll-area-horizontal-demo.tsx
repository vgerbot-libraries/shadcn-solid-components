import { VirtualScrollArea } from 'shadcn-solid-components/components/virtual-scroll-area'

const columnCount = 3000

const VirtualScrollAreaHorizontalDemo = () => {
  return (
    <VirtualScrollArea
      mode="horizontal"
      rowCount={1}
      columnCount={columnCount}
      overscan={12}
      estimateColumnSize={index => (index % 5 === 0 ? 180 : 120)}
      class="h-36 w-full rounded-md border"
      renderColumn={({ columnIndex }) => (
        <div class="flex h-full items-center justify-center border-r bg-muted/30 px-3 text-sm whitespace-nowrap">
          Event lane #{columnIndex + 1}
        </div>
      )}
    />
  )
}

export default VirtualScrollAreaHorizontalDemo
