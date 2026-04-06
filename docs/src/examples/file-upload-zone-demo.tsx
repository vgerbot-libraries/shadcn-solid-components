import { createSignal } from "solid-js"

import {
  FileUploadZone,
  type UploadFile,
} from "shadcn-solid-components/hoc/file-upload-zone"

let nextId = 0

const FileUploadZoneDemo = () => {
  const [files, setFiles] = createSignal<UploadFile[]>([])

  return (
    <FileUploadZone
      accept="image/*,.pdf"
      maxSize={5 * 1024 * 1024}
      maxFiles={5}
      value={files()}
      onFilesAdd={(added) => {
        const mapped: UploadFile[] = added.map((file) => ({
          id: String(++nextId),
          file,
          status: "pending",
        }))
        setFiles((prev) => [...prev, ...mapped])
      }}
      onRemove={(item) => {
        setFiles((prev) => prev.filter((file) => file.id !== item.id))
      }}
    />
  )
}

export default FileUploadZoneDemo
