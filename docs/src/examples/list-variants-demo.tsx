import {
  List,
  ListBody,
  ListItem,
  ListItemDescription,
  ListItemMain,
  ListItemTitle,
  type ListSize,
  type ListVariant,
} from 'shadcn-solid-components/components/list'
import { For } from 'solid-js'

const variants: ListVariant[] = ['default', 'outlined', 'filled', 'borderless']
const sizes: ListSize[] = ['sm', 'default', 'lg']

const ListVariantsDemo = () => {
  return (
    <div class="grid w-full gap-6">
      <For each={variants}>
        {variant => (
          <div class="space-y-2">
            <div class="text-muted-foreground text-xs font-medium uppercase">{variant}</div>
            <div class="grid gap-3 lg:grid-cols-3">
              <For each={sizes}>
                {size => (
                  <List variant={variant} size={size} split>
                    <ListBody>
                      <ListItem>
                        <ListItemMain>
                          <ListItemTitle>
                            {variant} / {size}
                          </ListItemTitle>
                          <ListItemDescription>
                            Density and container variant can be combined for different contexts.
                          </ListItemDescription>
                        </ListItemMain>
                      </ListItem>
                    </ListBody>
                  </List>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export default ListVariantsDemo
