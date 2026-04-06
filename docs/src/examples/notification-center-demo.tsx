import { createSignal } from "solid-js"

import {
  NotificationCenter,
  type NotificationItem,
} from "shadcn-solid-components/hoc/notification-center"

const NotificationCenterDemo = () => {
  const [items, setItems] = createSignal<NotificationItem[]>([
    { id: "1", title: "Build finished", category: "ci", read: false, time: "2m" },
    { id: "2", title: "New comment", category: "social", read: true },
  ])

  return (
    <NotificationCenter
      notifications={items()}
      categories={[
        { key: "ci", label: "CI" },
        { key: "social", label: "Social" },
      ]}
      onRead={(id) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))}
      onReadAll={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}
    />
  )
}

export default NotificationCenterDemo
