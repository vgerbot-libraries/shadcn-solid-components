import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconHome,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
} from "shadcn-solid-components/components/icons"

const IconsDemo = () => {
  const items = [
    { label: "IconCheck", icon: IconCheck },
    { label: "IconChevronDown", icon: IconChevronDown },
    { label: "IconSearch", icon: IconSearch },
    { label: "IconHome", icon: IconHome },
    { label: "IconSettings", icon: IconSettings },
    { label: "IconCalendar", icon: IconCalendar },
    { label: "IconUser", icon: IconUser },
    { label: "IconTrash", icon: IconTrash },
  ] as const

  return (
    <div class="flex flex-wrap items-center gap-6">
      {items.map(({ label, icon: Icon }) => (
        <div class="flex flex-col items-center gap-2">
          <div class="border-border bg-muted/40 flex size-12 items-center justify-center rounded-lg border">
            <Icon class="text-foreground size-6" aria-hidden />
          </div>
          <span class="text-muted-foreground max-w-[8rem] text-center text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default IconsDemo
