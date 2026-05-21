import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const icons = {
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9m-8.3 13a2 2 0 0 0 4.6 0',
  shield: 'M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z',
  sparkles: 'm12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2L12 3Z',
}

const Icon = (props: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d={props.path}
    />
  </svg>
)

const ItemIconDemo = () => {
  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <Item variant="outline">
        <ItemMedia>
          <Icon path={icons.bell} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Incident alerts</ItemTitle>
          <ItemDescription>Escalate downtime messages to the on-call channel.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span class="text-muted-foreground text-xs">Live</span>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <Icon path={icons.shield} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Audit log</ItemTitle>
          <ItemDescription>Track sensitive changes across the organization.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <Icon path={icons.sparkles} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Automation hints</ItemTitle>
          <ItemDescription>Surface suggested workflows for repetitive tasks.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export default ItemIconDemo
