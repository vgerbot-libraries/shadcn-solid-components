import { createSignal } from "solid-js"

import { FilterBuilder, type FilterRule } from "shadcn-solid-components/hoc/filter-builder"

const FilterBuilderDemo = () => {
  const [rules, setRules] = createSignal<FilterRule[]>([
    { field: "title", operator: "contains", value: "" },
  ])

  return (
    <FilterBuilder
      maxRules={6}
      fields={[
        { key: "title", label: "Title", type: "text" },
        {
          key: "state",
          label: "Status",
          type: "select",
          options: [
            { label: "Open", value: "open" },
            { label: "Closed", value: "closed" },
          ],
        },
        { key: "updatedAt", label: "Updated at", type: "date" },
      ]}
      value={rules()}
      onChange={setRules}
    />
  )
}

export default FilterBuilderDemo
