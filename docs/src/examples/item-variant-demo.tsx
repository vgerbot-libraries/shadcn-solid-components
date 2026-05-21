import { Button } from 'shadcn-solid-components/components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const ItemVariantDemo = () => {
  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <Item>
        <ItemContent>
          <ItemTitle>Roadmap note</ItemTitle>
          <ItemDescription>
            Capture general planning context without extra emphasis.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Customer request</ItemTitle>
          <ItemDescription>Highlight a row while keeping the background neutral.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Archived draft</ItemTitle>
          <ItemDescription>Use a quieter treatment for lower-priority rows.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="secondary" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="destructive">
        <ItemContent>
          <ItemTitle>Delete environment</ItemTitle>
          <ItemDescription>Mark irreversible actions with destructive styling.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="destructive" size="sm">
            Remove
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default ItemVariantDemo
