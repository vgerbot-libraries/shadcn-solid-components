import { Button } from 'shadcn-solid-components/components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const ItemSizeDemo = () => {
  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Compact queue</ItemTitle>
          <ItemDescription>Small rows for dense operational lists.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="default">
        <ItemContent>
          <ItemTitle>Review queue</ItemTitle>
          <ItemDescription>Default spacing for dashboard task rows.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="lg">
        <ItemContent>
          <ItemTitle>Featured briefing</ItemTitle>
          <ItemDescription>Large rows for prominent summaries and media.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default ItemSizeDemo
