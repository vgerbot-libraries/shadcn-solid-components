import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from 'shadcn-solid-components/components/item'

const tracks = [
  {
    title: 'Northstar Analytics',
    artist: 'Dashboard template',
    duration: '12 screens',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
  },
  {
    title: 'Commerce Control Room',
    artist: 'Operations layout',
    duration: '8 widgets',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop',
  },
]

const ItemImageDemo = () => {
  return (
    <div class="flex w-full max-w-lg flex-col gap-3">
      {tracks.map(track => (
        <Item variant="outline">
          <ItemMedia>
            <img
              src={track.cover}
              alt=""
              class="size-14 rounded-component object-cover grayscale"
              loading="lazy"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{track.title}</ItemTitle>
            <ItemDescription>{track.artist}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <span class="text-muted-foreground text-sm tabular-nums">{track.duration}</span>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}

export default ItemImageDemo
