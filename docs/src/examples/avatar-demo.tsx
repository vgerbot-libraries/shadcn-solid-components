import { Avatar, AvatarFallback, AvatarImage } from "shadcn-solid-components/components/avatar"

const AvatarDemo = () => {
  return (
    <div class="flex items-center gap-4">
      <Avatar src="https://github.com/shadcn.png">
        <AvatarImage alt="Shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>

      <Avatar class="size-12">
        <AvatarFallback>JY</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default AvatarDemo
