import { Button } from 'shadcn-solid-components/components/button'
import {
  List,
  ListBody,
  ListHeader,
  ListItem,
  ListItemActions,
  ListItemDescription,
  ListItemMain,
  ListItemMedia,
  ListItemMeta,
  ListItemSubTitle,
  ListItemTitle,
  ListToolbar,
} from 'shadcn-solid-components/components/list'
import { For } from 'solid-js'

const projects = [
  {
    id: '1',
    name: 'Retail Intelligence Dashboard',
    owner: 'Product Team',
    description:
      'Unify store metrics, campaign ROI, and conversion trends in one operational view.',
    status: 'In progress',
    members: 12,
  },
  {
    id: '2',
    name: 'Cloud Cost Monitor',
    owner: 'Infra Team',
    description: 'Track daily cost anomalies and automate budget alerts for each environment.',
    status: 'Review',
    members: 6,
  },
  {
    id: '3',
    name: 'Customer Support Copilot',
    owner: 'AI Team',
    description: 'Provide suggested replies and workflow actions for repetitive ticket requests.',
    status: 'Planning',
    members: 8,
  },
]

const ListDemo = () => {
  return (
    <List variant="outlined" split>
      <ListHeader>
        <h3 class="text-sm font-semibold">Project List</h3>
        <ListToolbar>
          <Button size="sm" variant="outline">
            New Project
          </Button>
        </ListToolbar>
      </ListHeader>

      <ListBody>
        <For each={projects}>
          {project => (
            <ListItem>
              <ListItemMedia>
                <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-component text-xs font-semibold">
                  {project.name.slice(0, 2).toUpperCase()}
                </div>
              </ListItemMedia>

              <ListItemMain>
                <ListItemTitle>{project.name}</ListItemTitle>
                <ListItemSubTitle>{project.owner}</ListItemSubTitle>
                <ListItemDescription>{project.description}</ListItemDescription>
                <ListItemMeta>
                  <span>{project.status}</span>
                  <span>•</span>
                  <span>{project.members} members</span>
                </ListItemMeta>
              </ListItemMain>

              <ListItemActions>
                <Button size="sm" variant="ghost">
                  Open
                </Button>
              </ListItemActions>
            </ListItem>
          )}
        </For>
      </ListBody>
    </List>
  )
}

export default ListDemo
