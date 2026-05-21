import { Button } from 'shadcn-solid-components/components/button'
import {
  List,
  ListBody,
  ListEmpty,
  ListHeader,
  ListItem,
  ListItemMain,
  ListItemMeta,
  ListItemTitle,
  ListSkeleton,
  ListToolbar,
} from 'shadcn-solid-components/components/list'
import { createSignal, For, Show } from 'solid-js'

const initialItems = ['Design Review', 'Sprint Planning', 'Release Checklist']

const ListToolbarDemo = () => {
  const [loading, setLoading] = createSignal(false)
  const [items, setItems] = createSignal(initialItems)

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 900)
  }

  return (
    <List variant="outlined" split>
      <ListHeader>
        <h3 class="text-sm font-semibold">Tasks</h3>
        <ListToolbar>
          <Button size="sm" variant="outline" onClick={toggleLoading}>
            Reload
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setItems([])}>
            Clear
          </Button>
          <Button size="sm" onClick={() => setItems(initialItems)}>
            Reset
          </Button>
        </ListToolbar>
      </ListHeader>

      <ListBody>
        <Show when={!loading()} fallback={<ListSkeleton rows={3} />}>
          <Show when={items().length > 0} fallback={<ListEmpty>No tasks available.</ListEmpty>}>
            <For each={items()}>
              {item => (
                <ListItem>
                  <ListItemMain>
                    <ListItemTitle>{item}</ListItemTitle>
                  </ListItemMain>
                  <ListItemMeta>Today</ListItemMeta>
                </ListItem>
              )}
            </For>
          </Show>
        </Show>
      </ListBody>
    </List>
  )
}

export default ListToolbarDemo
