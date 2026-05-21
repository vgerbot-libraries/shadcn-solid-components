import { Button } from 'shadcn-solid-components/components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const BadgeCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m9 18 6-6-6-6"
    />
  </svg>
)

const ItemDemo = () => {
  return (
    <div class="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Quarterly planning</ItemTitle>
          <ItemDescription>Review roadmap notes before the strategy meeting.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Review
          </Button>
        </ItemActions>
      </Item>
      <Item as="a" href="#" variant="outline" size="sm">
        <ItemMedia>
          <BadgeCheckIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Workspace security checks passed.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon />
        </ItemActions>
      </Item>
    </div>
  )
}

export default ItemDemo
