import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const ItemHeaderDemo = () => {
  return (
    <div class="w-full max-w-md rounded-component border p-2">
      <ItemGroup>
        <ItemHeader>Workspace</ItemHeader>
        <Item>
          <ItemContent>
            <ItemTitle>Members</ItemTitle>
            <ItemDescription>Manage collaborators and default access roles.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <span class="text-muted-foreground text-xs">⌘M</span>
          </ItemActions>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Billing</ItemTitle>
            <ItemDescription>Update invoices, plan limits, and payment method.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <span class="text-muted-foreground text-xs">⌘B</span>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}

export default ItemHeaderDemo
