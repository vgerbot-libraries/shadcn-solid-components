import { Avatar, AvatarFallback, AvatarImage } from 'shadcn-solid-components/components/avatar'
import { Button } from 'shadcn-solid-components/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'shadcn-solid-components/components/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const people = [
  {
    username: 'maya',
    avatar: 'https://i.pravatar.cc/96?img=21',
    email: 'maya@acme.test',
  },
  {
    username: 'noah',
    avatar: 'https://i.pravatar.cc/96?img=15',
    email: 'noah@acme.test',
  },
  {
    username: 'iris',
    avatar: 'https://i.pravatar.cc/96?img=45',
    email: 'iris@acme.test',
  },
]

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m6 9 6 6 6-6"
    />
  </svg>
)

const ItemDropdownDemo = () => {
  return (
    <div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger as="div">
          <Button variant="outline" size="sm" class="w-fit">
            Assign owner <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-72">
          {people.map(person => (
            <DropdownMenuItem class="p-0">
              <Item size="sm" class="w-full p-2">
                <ItemMedia>
                  <Avatar class="size-8" src={person.avatar}>
                    <AvatarImage alt={person.username} class="grayscale" />
                    <AvatarFallback>{person.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent class="gap-0.5">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription>{person.email}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ItemDropdownDemo
