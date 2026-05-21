import { Avatar, AvatarFallback, AvatarImage } from 'shadcn-solid-components/components/avatar'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 5v14m-7-7h14"
    />
  </svg>
)

const ItemAvatarDemo = () => {
  return (
    <div class="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar class="size-10" src="https://i.pravatar.cc/96?img=12">
            <AvatarImage alt="Maya Patel" />
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Maya Patel</ItemTitle>
          <ItemDescription>Product lead · active 12 minutes ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="outline" class="rounded-full" aria-label="Invite">
            <PlusIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar class="hidden sm:flex" src="https://i.pravatar.cc/96?img=32">
              <AvatarImage alt="Noah Chen" />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
            <Avatar class="hidden sm:flex" src="https://i.pravatar.cc/96?img=47">
              <AvatarImage alt="Iris Morgan" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
            <Avatar src="https://i.pravatar.cc/96?img=5">
              <AvatarImage alt="Leo Rivera" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Design review squad</ItemTitle>
          <ItemDescription>Three reviewers are ready for the launch checklist.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Open</Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default ItemAvatarDemo
