import {
  List,
  ListBody,
  ListItem,
  ListItemDescription,
  ListItemMain,
  ListItemMeta,
  ListItemTitle,
} from 'shadcn-solid-components/components/list'
import { For } from 'solid-js'

const items = [
  {
    name: 'Daily Growth Report',
    summary: 'Track activation, retention, and conversion with daily trend snapshots.',
    meta: 'Updated 10m ago',
  },
  {
    name: 'Incident Timeline',
    summary: 'A chronological digest of alerts, owner handoffs, and mitigation steps.',
    meta: 'Updated 35m ago',
  },
]

const ListLayoutDemo = () => {
  return (
    <div class="grid w-full gap-4 lg:grid-cols-2">
      <List variant="outlined" itemLayout="horizontal" split>
        <ListBody>
          <For each={items}>
            {item => (
              <ListItem>
                <ListItemMain>
                  <ListItemTitle>{item.name}</ListItemTitle>
                  <ListItemDescription>{item.summary}</ListItemDescription>
                </ListItemMain>
                <ListItemMeta>{item.meta}</ListItemMeta>
              </ListItem>
            )}
          </For>
        </ListBody>
      </List>

      <List variant="outlined" itemLayout="vertical" split>
        <ListBody>
          <For each={items}>
            {item => (
              <ListItem>
                <ListItemMain>
                  <ListItemTitle>{item.name}</ListItemTitle>
                  <ListItemDescription>{item.summary}</ListItemDescription>
                </ListItemMain>
                <ListItemMeta>{item.meta}</ListItemMeta>
              </ListItem>
            )}
          </For>
        </ListBody>
      </List>
    </div>
  )
}

export default ListLayoutDemo
