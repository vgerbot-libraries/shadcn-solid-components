import type { ColumnDef } from "@tanstack/solid-table"
import {
  TanstackTable,
  TanstackTableBody,
  TanstackTableHeader,
  createSolidTable,
  getCoreRowModel,
} from "shadcn-solid-components/components/tanstack-table"

type Person = { id: string; name: string; role: string }

const data: Person[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Lin", role: "Designer" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
]

const TanstackTablePreviewDemo = () => {
  const table = createSolidTable({
    get data() {
      return data
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div class="border-border w-full max-w-xl rounded-md border">
      <TanstackTable table={table}>
        <TanstackTableHeader />
        <TanstackTableBody />
      </TanstackTable>
    </div>
  )
}

export default TanstackTablePreviewDemo
