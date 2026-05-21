import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

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

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 3h6v6m-10 4L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    />
  </svg>
)

const ItemLinkDemo = () => {
  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <Item as="a" href="#">
        <ItemContent>
          <ItemTitle>Open implementation guide</ItemTitle>
          <ItemDescription>Review slot structure and composition examples.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon />
        </ItemActions>
      </Item>
      <Item as="a" href="#" target="_blank" rel="noopener noreferrer" variant="outline">
        <ItemContent>
          <ItemTitle>View design checklist</ItemTitle>
          <ItemDescription>Open the shared launch checklist in a new tab.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon />
        </ItemActions>
      </Item>
    </div>
  )
}

export default ItemLinkDemo
