import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const ItemGroupDemo = () => {
  return (
    <ItemGroup class="w-full max-w-md">
      <ItemHeader>Release tasks</ItemHeader>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Freeze copy updates</ItemTitle>
          <ItemDescription>Marketing pages are ready for final proofreading.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span class="text-muted-foreground text-xs">Due today</span>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Validate billing flow</ItemTitle>
          <ItemDescription>Run a purchase test against the staging gateway.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span class="text-muted-foreground text-xs">QA</span>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Publish changelog</ItemTitle>
          <ItemDescription>Summarize the dashboard improvements for users.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span class="text-muted-foreground text-xs">Draft</span>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}

export default ItemGroupDemo
