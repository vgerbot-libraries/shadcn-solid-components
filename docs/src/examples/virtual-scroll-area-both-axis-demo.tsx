import { VirtualScrollArea } from 'shadcn-solid-components/components/virtual-scroll-area'

const rowCount = 2000
const columnCount = 200

const VirtualScrollAreaBothAxisDemo = () => {
  return (
    <VirtualScrollArea
      mode="both"
      rowCount={rowCount}
      columnCount={columnCount}
      overscan={6}
      estimateRowSize={() => 40}
      estimateColumnSize={columnIndex => (columnIndex === 0 ? 180 : 120)}
      class="h-80 w-full rounded-md border"
      renderCell={({ rowIndex, columnIndex }) => (
        <div
          class="flex h-full items-center border-r border-b px-3 text-xs"
          classList={{
            'bg-muted/50 font-medium': rowIndex === 0 || columnIndex === 0,
          }}
        >
          R{rowIndex + 1} · C{columnIndex + 1}
        </div>
      )}
    />
  )
}

export default VirtualScrollAreaBothAxisDemo
