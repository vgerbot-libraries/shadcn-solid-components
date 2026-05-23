import { Button } from 'shadcn-solid-components/components/button'
import { VirtualScrollArea } from 'shadcn-solid-components/components/virtual-scroll-area'
import { createSignal } from 'solid-js'

const PAGE_SIZE = 120

const VirtualScrollAreaLoadMoreDemo = () => {
  const [rowCount, setRowCount] = createSignal(PAGE_SIZE)
  const [hasMoreRows, setHasMoreRows] = createSignal(true)

  const loadMoreRows = async () => {
    await new Promise(resolve => setTimeout(resolve, 300))

    setRowCount(prev => {
      const next = prev + PAGE_SIZE
      if (next >= 720) {
        setHasMoreRows(false)
      }
      return next
    })
  }

  const reset = () => {
    setRowCount(PAGE_SIZE)
    setHasMoreRows(true)
  }

  return (
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={reset}>
          Reset
        </Button>
        <span class="text-muted-foreground text-xs">
          count: {rowCount()} {hasMoreRows() ? '(auto load more)' : '(end)'}
        </span>
      </div>

      <VirtualScrollArea
        mode="vertical"
        rowCount={rowCount}
        hasMoreRows={hasMoreRows}
        onLoadMoreRows={loadMoreRows}
        loadMoreThreshold={10}
        estimateRowSize={() => 42}
        class="h-80 w-full rounded-md border"
        renderRow={({ rowIndex }) => (
          <div class="flex h-full items-center border-b px-3 text-sm">Item {rowIndex + 1}</div>
        )}
      />
    </div>
  )
}

export default VirtualScrollAreaLoadMoreDemo
