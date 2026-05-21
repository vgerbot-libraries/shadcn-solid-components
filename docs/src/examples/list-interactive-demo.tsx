import { Button } from 'shadcn-solid-components/components/button'
import {
  List,
  ListBody,
  ListItem,
  ListItemDescription,
  ListItemMain,
  ListItemMedia,
  ListItemMeta,
  ListItemTitle,
} from 'shadcn-solid-components/components/list'
import { createSignal, For } from 'solid-js'

type Ticket = {
  id: string
  title: string
  summary: string
  priority: 'High' | 'Medium' | 'Low'
}

const tickets: Ticket[] = [
  {
    id: 'TK-1923',
    title: 'Checkout timeout on mobile',
    summary: 'Users report intermittent timeout during payment confirmation.',
    priority: 'High',
  },
  {
    id: 'TK-1931',
    title: 'Search relevance tuning',
    summary: 'Improve ranking for typo tolerant queries in product search.',
    priority: 'Medium',
  },
  {
    id: 'TK-1945',
    title: 'Notification digest layout',
    summary: 'Refine spacing and section hierarchy in weekly digest email.',
    priority: 'Low',
  },
]

const ListInteractiveDemo = () => {
  const [selectedId, setSelectedId] = createSignal<string | null>(tickets[0]?.id ?? null)
  const [expandedId, setExpandedId] = createSignal<string | null>(tickets[0]?.id ?? null)

  return (
    <List variant="outlined" split>
      <ListBody>
        <For each={tickets}>
          {ticket => {
            const isSelected = () => selectedId() === ticket.id
            const isExpanded = () => expandedId() === ticket.id

            return (
              <ListItem
                selected={isSelected()}
                expanded={isExpanded()}
                class="cursor-pointer"
                onClick={() => setSelectedId(ticket.id)}
              >
                <ListItemMedia>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={isExpanded() ? 'Collapse row' : 'Expand row'}
                    onClick={event => {
                      event.stopPropagation()
                      setExpandedId(isExpanded() ? null : ticket.id)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="size-4 transition-transform"
                      classList={{
                        'rotate-90': isExpanded(),
                      }}
                    >
                      <path d="m9 6l6 6l-6 6" />
                    </svg>
                  </Button>
                </ListItemMedia>

                <ListItemMain>
                  <ListItemTitle>{ticket.title}</ListItemTitle>
                  <ListItemMeta>
                    <span>{ticket.id}</span>
                    <span>•</span>
                    <span>{ticket.priority}</span>
                  </ListItemMeta>
                  {isExpanded() && <ListItemDescription>{ticket.summary}</ListItemDescription>}
                </ListItemMain>
              </ListItem>
            )
          }}
        </For>
      </ListBody>
    </List>
  )
}

export default ListInteractiveDemo
