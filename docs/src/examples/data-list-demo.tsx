import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import { DataList, type DataListColumn } from 'shadcn-solid-components/hoc/data-list'
import { createSignal } from 'solid-js'

type Project = {
  id: string
  name: string
  owner: string
  description: string
  status: 'planning' | 'developing' | 'done'
  category: string
}

const allProjects: Project[] = [
  {
    id: 'p-1',
    name: 'Retail Analytics Platform',
    owner: 'Product Team',
    description: 'Consolidate campaign metrics and store conversion trends in one dashboard.',
    status: 'developing',
    category: 'Data',
  },
  {
    id: 'p-2',
    name: 'Customer Support Copilot',
    owner: 'AI Team',
    description: 'Assist agents with response drafts and action recommendations.',
    status: 'planning',
    category: 'AI',
  },
  {
    id: 'p-3',
    name: 'Cost Guardrail Monitor',
    owner: 'Infra Team',
    description: 'Detect abnormal cloud spending and trigger budget alerts automatically.',
    status: 'done',
    category: 'Infrastructure',
  },
  {
    id: 'p-4',
    name: 'Warehouse Replenishment Optimizer',
    owner: 'Operations Team',
    description: 'Balance stock levels and replenishment timing based on demand forecasts.',
    status: 'developing',
    category: 'Operations',
  },
]

const columns: DataListColumn<Project>[] = [
  {
    dataIndex: 'name',
    title: 'Name',
    listSlot: 'title',
  },
  {
    dataIndex: 'owner',
    title: 'Owner',
    listSlot: 'subTitle',
  },
  {
    dataIndex: 'description',
    title: 'Description',
    listSlot: 'description',
  },
  {
    dataIndex: 'status',
    title: 'Status',
    listSlot: 'type',
    valueEnum: {
      planning: { text: 'Planning' },
      developing: { text: 'Developing' },
      done: { text: 'Done' },
    },
    render: value => {
      const text = typeof value === 'string' ? value : ''
      const variant = text === 'done' ? 'secondary' : text === 'developing' ? 'default' : 'outline'
      return (
        <Badge variant={variant === 'outline' ? 'outline' : variant} class="capitalize">
          {text}
        </Badge>
      )
    },
  },
  {
    dataIndex: 'category',
    title: 'Category',
    listSlot: 'aside',
    render: value => <span class="text-muted-foreground text-xs">{String(value)}</span>,
  },
  {
    key: 'actions',
    title: 'Actions',
    listSlot: 'actions',
    search: false,
    render: () => (
      <Button size="sm" variant="ghost">
        Open
      </Button>
    ),
  },
]

const DataListDemo = () => {
  const [params, setParams] = createSignal<{ owner?: string }>({})

  return (
    <div class="w-full space-y-3">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setParams({})}>
          All owners
        </Button>
        <Button size="sm" variant="outline" onClick={() => setParams({ owner: 'AI Team' })}>
          Owner: AI Team
        </Button>
      </div>

      <DataList<Project, { owner?: string }>
        columns={columns}
        params={params()}
        request={async requestParams => {
          const keyword = requestParams.keyword?.toLowerCase().trim() ?? ''
          const filtered = allProjects.filter(project => {
            const ownerMatch = requestParams.owner ? project.owner === requestParams.owner : true
            const keywordMatch = keyword
              ? `${project.name} ${project.owner} ${project.description} ${project.category}`
                  .toLowerCase()
                  .includes(keyword)
              : true
            return ownerMatch && keywordMatch
          })

          const current = requestParams.current ?? 1
          const pageSize = requestParams.pageSize ?? 2
          const start = (current - 1) * pageSize

          return {
            data: filtered.slice(start, start + pageSize),
            success: true,
            total: filtered.length,
          }
        }}
        rowKey="id"
        headerTitle={<h3 class="text-sm font-semibold">Data List</h3>}
        search={{ placeholder: 'Search projects...' }}
        pagination={{ pageSize: 2 }}
        rowSelection={{
          onChange: () => {},
        }}
        expandable={{
          expandedRowRender: project => (
            <div class="text-muted-foreground rounded-component bg-muted/50 p-2 text-sm">
              Detail: {project.description}
            </div>
          ),
        }}
      />
    </div>
  )
}

export default DataListDemo
