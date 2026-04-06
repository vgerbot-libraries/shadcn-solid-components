import { createSignal } from "solid-js"
import {
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/solid-table"

import { Button } from "shadcn-solid-components/components/button"
import { DataTableToolbar } from "shadcn-solid-components/hoc/data-table-toolbar"

type Row = { id: string; name: string }

const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }]

const DataTableToolbarDemo = () => {
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])

  const table = createSolidTable({
    get data() {
      return [
        { id: "1", name: "Ada" },
        { id: "2", name: "Grace" },
      ]
    },
    columns,
    state: {
      get columnFilters() {
        return columnFilters()
      },
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <DataTableToolbar
      table={table}
      searchColumn="name"
      filters={<span class="text-sm text-muted-foreground">Custom filters</span>}
      actions={<Button size="sm">Export</Button>}
    />
  )
}

export default DataTableToolbarDemo
