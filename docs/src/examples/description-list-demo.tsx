import { Button } from "shadcn-solid-components/components/button"
import { DescriptionList } from "shadcn-solid-components/hoc/description-list"

const DescriptionListDemo = () => {
  return (
    <DescriptionList
      card
      title="Account"
      layout="horizontal"
      columns={2}
      actions={<Button size="sm">Edit</Button>}
      items={[
        { label: "Username", value: "ada" },
        { label: "Email", value: "ada@example.com", copyable: true },
        { label: "Plan", value: "Pro", span: 2 },
      ]}
    />
  )
}

export default DescriptionListDemo
