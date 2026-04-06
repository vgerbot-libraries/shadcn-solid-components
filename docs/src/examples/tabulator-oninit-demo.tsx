import { createSignal } from "solid-js"

import { TabulatorTable } from "shadcn-solid-components/components/tabulator-table"

import "shadcn-solid-components/src/components/tabulator-table/tabulator-shadcn.css"

const TabulatorOnInitDemo = () => {
  const [status, setStatus] = createSignal("Mounting...")

  return (
    <div class="w-full max-w-3xl space-y-2">
      <p class="text-muted-foreground text-sm">
        <span class="text-foreground font-medium">onInit:</span>
        {status()}
      </p>
      <TabulatorTable
        class="w-full overflow-hidden rounded-md border"
        initOptions={{
          data: [
            { id: 1, name: "North", value: 12 },
            { id: 2, name: "South", value: 8 },
          ],
          columns: [
            { title: "ID", field: "id", width: 64, hozAlign: "center" },
            { title: "Region", field: "name" },
            { title: "Count", field: "value", hozAlign: "right" },
          ],
          layout: "fitColumns",
          height: 160,
        }}
        onInit={(instance) => {
          setStatus(`Table ready with ${instance.getDataCount()} rows`)
        }}
      />
    </div>
  )
}

export default TabulatorOnInitDemo
