import { createSignal } from "solid-js"

import { TagInput } from "shadcn-solid-components/hoc/tag-input"

const TagInputDemo = () => {
  const [tags, setTags] = createSignal<string[]>(["solid"])

  return (
    <TagInput
      value={tags()}
      onChange={setTags}
      suggestions={["solid", "tailwind", "kobalte"]}
      allowCreate={false}
      placeholder="Pick from the list..."
    />
  )
}

export default TagInputDemo
