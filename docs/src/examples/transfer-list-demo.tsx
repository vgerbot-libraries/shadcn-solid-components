import { createSignal } from "solid-js"

import { TransferList, type TransferItem } from "shadcn-solid-components/hoc/transfer-list"

const catalog: TransferItem[] = [
  { key: "a", label: "Alpha", description: "First option" },
  { key: "b", label: "Beta", disabled: true },
  { key: "c", label: "Gamma", description: "Third option" },
]

const TransferListDemo = () => {
  const [selected, setSelected] = createSignal<string[]>(["a"])

  return (
    <TransferList
      source={catalog}
      target={selected()}
      onChange={setSelected}
      titles={["Pool", "Assigned"]}
      searchable={false}
    />
  )
}

export default TransferListDemo
