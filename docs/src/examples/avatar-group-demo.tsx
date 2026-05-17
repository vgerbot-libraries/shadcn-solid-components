import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "shadcn-solid-components/components/avatar"

const AvatarGroupDemo = () => {
  return (
    <AvatarGroup max={4} total={6}>
      <Avatar src="https://github.com/shadcn.png" class="size-9">
        <AvatarImage alt="Shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar src="https://i.pravatar.cc/80?img=8" class="size-9">
        <AvatarImage alt="Mia" />
        <AvatarFallback>MI</AvatarFallback>
      </Avatar>
      <Avatar src="https://i.pravatar.cc/80?img=12" class="size-9">
        <AvatarImage alt="Noah" />
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
      <Avatar src="https://i.pravatar.cc/80?img=22" class="size-9">
        <AvatarImage alt="Ava" />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
      <Avatar src="https://i.pravatar.cc/80?img=31" class="size-9">
        <AvatarImage alt="Liam" />
        <AvatarFallback>LI</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}

export default AvatarGroupDemo
