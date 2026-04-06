import { TabulatorTable } from "shadcn-solid-components/components/tabulator-table"

import "shadcn-solid-components/src/components/tabulator-table/tabulator-shadcn.css"

const TabulatorTableDemo = () => {
  return (
    <div class="w-full max-w-3xl">
      <TabulatorTable
        class="w-full overflow-hidden rounded-md border"
        initOptions={{
          data: [
            { id: 1, name: "Alpha", role: "Admin" },
            { id: 2, name: "Beta", role: "Editor" },
            { id: 3, name: "Gamma", role: "Viewer" },
          ],
          columns: [
            { title: "ID", field: "id", width: 72, hozAlign: "center" },
            { title: "Name", field: "name" },
            { title: "Role", field: "role" },
          ],
          layout: "fitColumns",
          height: 200,
        }}
      />
    </div>
  )
}

export default TabulatorTableDemo
